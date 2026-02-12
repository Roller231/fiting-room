import os
import traceback
from pathlib import Path
from io import BytesIO
from PIL import Image, ImageFilter
from google import genai
from google.genai import types
from dotenv import load_dotenv
from rembg import remove as rembg_remove
from ..utils import abs_media_path

load_dotenv()

# ── Настройки ──────────────────────────────────────────────
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
GEMINI_TEXT_MODEL = os.getenv("GEMINI_TEXT_MODEL", "gemini-2.5-flash")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

_client: genai.Client | None = None

# Максимальный размер стороны изображения для отправки в API
MAX_IMAGE_SIDE = 1536


def get_client() -> genai.Client:
    """
    Возвращает singleton клиента Gemini. Создаёт при первом вызове.
    """
    global _client
    if _client is None:
        if not GOOGLE_API_KEY:
            raise RuntimeError("GOOGLE_API_KEY is not set in environment")
        os.environ["GOOGLE_API_KEY"] = GOOGLE_API_KEY
        _client = genai.Client(http_options={"base_url": "https://api.proxyapi.ru/google"})
    return _client


# ── Утилиты ────────────────────────────────────────────────

def _image_bytes(path: Path) -> bytes:
    """Читает файл и возвращает его байты."""
    with open(path, "rb") as f:
        return f.read()


def _safe_delete(path: Path):
    """Безопасно удаляет файл, если существует."""
    try:
        if path.exists():
            path.unlink()
            print(f"[INFO] Временный файл удалён: {path}")
    except Exception as e:
        print(f"[WARN] Не удалось удалить файл {path}: {e}")


def _resize_if_needed(img: Image.Image, max_side: int = MAX_IMAGE_SIDE) -> Image.Image:
    """Уменьшает изображение, если любая сторона > max_side (сохраняет пропорции)."""
    w, h = img.size
    if max(w, h) <= max_side:
        return img
    ratio = max_side / max(w, h)
    new_size = (int(w * ratio), int(h * ratio))
    return img.resize(new_size, Image.LANCZOS)


def _to_png_bytes(img: Image.Image) -> bytes:
    """Конвертирует PIL Image в PNG-байты."""
    buf = BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _to_jpeg_bytes(img: Image.Image, quality: int = 90) -> bytes:
    """Конвертирует PIL Image в JPEG-байты."""
    rgb = img.convert("RGB") if img.mode != "RGB" else img
    buf = BytesIO()
    rgb.save(buf, format="JPEG", quality=quality)
    return buf.getvalue()


# ── Шаг 1: Сегментация одежды (удаление фона) ─────────────

def _segment_clothing(clothes_bytes: bytes) -> tuple[bytes, bytes]:
    """
    Удаляет фон с фото одежды через rembg.
    Возвращает (segmented_png_bytes, mask_png_bytes).
    segmented — одежда на прозрачном фоне (RGBA PNG).
    mask — чёрно-белая маска (белый = одежда).
    """
    print("[STEP 1] Сегментация одежды — удаление фона...")
    segmented_data = rembg_remove(clothes_bytes)

    segmented_img = Image.open(BytesIO(segmented_data)).convert("RGBA")
    segmented_img = _resize_if_needed(segmented_img)

    # Извлекаем альфа-канал как маску
    alpha = segmented_img.split()[3]
    # Бинаризуем: > 128 → белый, иначе чёрный
    mask = alpha.point(lambda p: 255 if p > 128 else 0, mode="1").convert("L")
    # Лёгкое размытие маски для мягких краёв
    mask = mask.filter(ImageFilter.GaussianBlur(radius=1))

    seg_bytes = _to_png_bytes(segmented_img)
    mask_bytes = _to_png_bytes(mask)
    print(f"[STEP 1] Сегментация завершена. Размер: {segmented_img.size}")
    return seg_bytes, mask_bytes


# ── Шаг 2: Анализ одежды (тип, материал, текстура) ────────

def _analyze_clothing(segmented_bytes: bytes) -> str:
    """
    Использует Gemini для детального анализа одежды:
    тип, материал/ткань, текстура, цвет, паттерн, фасон.
    """
    print("[STEP 2] Анализ одежды через Gemini...")
    client = get_client()

    analysis_prompt = (
        "You are a fashion expert. Analyze this clothing item image in detail.\n"
        "The image has a transparent/removed background — focus ONLY on the garment.\n\n"
        "Provide a concise structured analysis:\n"
        "1. **Type**: (e.g., t-shirt, blazer, dress, jeans, hoodie, coat)\n"
        "2. **Material/Fabric**: (e.g., cotton, denim, silk, polyester, wool, leather, linen)\n"
        "3. **Texture**: (e.g., smooth, ribbed, knitted, woven, quilted, distressed)\n"
        "4. **Color(s)**: exact colors and any gradients\n"
        "5. **Pattern**: (e.g., solid, striped, plaid, floral, graphic print)\n"
        "6. **Fit/Silhouette**: (e.g., oversized, slim-fit, relaxed, cropped, A-line)\n"
        "7. **Notable details**: (buttons, zippers, pockets, collar style, seams, embroidery)\n\n"
        "Be precise and factual. Answer in English. No markdown formatting, just plain text."
    )

    parts = [
        types.Part.from_bytes(data=segmented_bytes, mime_type="image/png"),
        analysis_prompt,
    ]

    resp = client.models.generate_content(
        model=GEMINI_TEXT_MODEL,
        contents=parts,
        config=types.GenerateContentConfig(
            response_modalities=["TEXT"],
            temperature=0.2,
        ),
    )

    analysis = ""
    for cand in resp.candidates:
        for part in cand.content.parts:
            if hasattr(part, "text") and part.text:
                analysis += part.text

    analysis = analysis.strip()
    if not analysis:
        analysis = "Standard clothing item"
    print(f"[STEP 2] Анализ одежды:\n{analysis}")
    return analysis


# ── Шаг 3: Генерация try-on ───────────────────────────────

def _generate_tryon(
    person_bytes: bytes,
    segmented_clothes_bytes: bytes,
    mask_bytes: bytes,
    clothing_analysis: str,
    extra_prompt: str | None,
) -> bytes:
    """
    Финальная генерация: человек + сегментированная одежда + маска + анализ материала.
    """
    print("[STEP 3] Генерация виртуальной примерки...")
    client = get_client()

    tryon_prompt = (
        "You are an advanced virtual try-on system.\n\n"
        "You are given THREE images:\n"
        "- IMAGE 1: A photo of a real person (the model).\n"
        "- IMAGE 2: A clothing item with background removed (transparent PNG).\n"
        "- IMAGE 3: A binary mask showing the exact silhouette of the clothing item (white = garment).\n\n"
        f"CLOTHING ANALYSIS:\n{clothing_analysis}\n\n"
        "YOUR TASK: Generate a single photorealistic image of the EXACT same person from Image 1 "
        "wearing the clothing item from Image 2.\n\n"
        "CRITICAL REQUIREMENTS:\n"
        "1. PERSON PRESERVATION: The person's face, body shape, pose, skin tone, hair, and proportions "
        "must be IDENTICAL to Image 1. Do NOT alter ANY facial features or body parts.\n"
        "2. CLOTHING FIT: The garment must conform naturally to the person's body. Use the mask (Image 3) "
        "as a reference for the garment's shape, but warp/deform it to match the person's pose and body.\n"
        "3. MATERIAL FIDELITY: Reproduce the EXACT fabric texture, weave, sheen, and drape described in "
        "the clothing analysis above. The material must look physically accurate — cotton should look matte, "
        "silk should have subtle sheen, denim should show weave texture, leather should reflect light.\n"
        "4. PHYSICS: Add realistic wrinkles, folds, and creases where the fabric naturally bends "
        "(elbows, waist, shoulders). Heavier fabrics drape differently than light ones.\n"
        "5. LIGHTING: Match the lighting direction, intensity, shadows, and color temperature from Image 1. "
        "The clothing must cast and receive shadows consistently with the scene.\n"
        "6. BACKGROUND: Keep the original background from Image 1 completely unchanged.\n"
        "7. EDGES: The garment edges must blend seamlessly with the person's body — no visible cut lines, "
        "halos, or artifacts at the boundary.\n"
        "8. OUTPUT: Return ONLY the final image. No text, no watermarks, no labels, no borders.\n"
    )

    if extra_prompt:
        tryon_prompt += f"\nADDITIONAL INSTRUCTIONS: {extra_prompt}\n"

    parts = [
        types.Part.from_bytes(data=person_bytes, mime_type="image/jpeg"),
        types.Part.from_bytes(data=segmented_clothes_bytes, mime_type="image/png"),
        types.Part.from_bytes(data=mask_bytes, mime_type="image/png"),
        tryon_prompt,
    ]

    resp = client.models.generate_content(
        model=GEMINI_IMAGE_MODEL,
        contents=parts,
        config=types.GenerateContentConfig(
            response_modalities=["IMAGE", "TEXT"],
            temperature=0.3,
        ),
    )

    for cand in resp.candidates:
        for part in cand.content.parts:
            if getattr(part, "inline_data", None) and part.inline_data.data:
                img = Image.open(BytesIO(part.inline_data.data)).convert("RGBA")
                out = BytesIO()
                img.save(out, format="PNG")
                print("[STEP 3] Генерация успешно завершена.")
                return out.getvalue()

    raise RuntimeError("Gemini не вернул изображение на шаге генерации.")


# ── Главная функция ────────────────────────────────────────

def run_try_on(user_photo_path: str, product_photo_path: str, prompt_text: str | None) -> bytes:
    """
    Генерирует изображение, где на человеке (user_photo_path)
    надета одежда (product_photo_path).

    Пайплайн:
      1. Сегментация одежды (rembg) → чистый вырез + маска
      2. Анализ одежды (Gemini text) → тип, материал, текстура
      3. Генерация try-on (Gemini image) → финальный результат

    user_photo_path, product_photo_path — относительные пути от MEDIA_ROOT.
    Возвращает PNG-байты результата.
    """

    abs_user_path = abs_media_path(user_photo_path)
    abs_product_path = abs_media_path(product_photo_path)

    print(f"[INFO] Запуск примерки (улучшенный пайплайн):")
    print(f" - Фото пользователя: {abs_user_path}")
    print(f" - Фото товара: {abs_product_path}")

    try:
        # Читаем исходные изображения
        raw_person_bytes = _image_bytes(abs_user_path)
        raw_clothes_bytes = _image_bytes(abs_product_path)

        # Ресайзим фото пользователя
        person_img = Image.open(BytesIO(raw_person_bytes))
        person_img = _resize_if_needed(person_img)
        person_bytes = _to_jpeg_bytes(person_img)

        # ── Шаг 1: Сегментация ──
        segmented_bytes, mask_bytes = _segment_clothing(raw_clothes_bytes)

        # ── Шаг 2: Анализ материала ──
        clothing_analysis = _analyze_clothing(segmented_bytes)

        # ── Шаг 3: Генерация try-on ──
        result_png = _generate_tryon(
            person_bytes=person_bytes,
            segmented_clothes_bytes=segmented_bytes,
            mask_bytes=mask_bytes,
            clothing_analysis=clothing_analysis,
            extra_prompt=prompt_text,
        )

        print("[INFO] Примерка успешно выполнена (3-step pipeline).")
        return result_png

    except Exception as e:
        print("[ERROR] Ошибка при работе с Gemini:")
        traceback.print_exc()
        raise RuntimeError(f"Ошибка во время генерации: {e}")

    finally:
        _safe_delete(abs_user_path)
