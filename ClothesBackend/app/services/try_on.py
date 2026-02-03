import os
import traceback
from pathlib import Path
from io import BytesIO
from PIL import Image
from google import genai
from google.genai import types
from dotenv import load_dotenv
from ..utils import abs_media_path

load_dotenv()

# Настройки модели и ключа
GEMINI_IMAGE_MODEL = os.getenv("GEMINI_IMAGE_MODEL", "gemini-2.5-flash-image")
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

# Глобальный клиент, чтобы не создавать заново каждый раз
_client: genai.Client | None = None


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


def run_try_on(user_photo_path: str, product_photo_path: str, prompt_text: str | None) -> bytes:
    """
    Генерирует изображение, где на человеке (user_photo_path)
    надета одежда (product_photo_path).

    user_photo_path, product_photo_path — относительные пути от MEDIA_ROOT.
    Возвращает PNG-байты результата.
    """

    # Абсолютные пути
    abs_user_path = abs_media_path(user_photo_path)
    abs_product_path = abs_media_path(product_photo_path)

    print(f"[INFO] Запуск примерки:")
    print(f" - Фото пользователя: {abs_user_path}")
    print(f" - Фото товара: {abs_product_path}")

    client = get_client()

    try:
        # Читаем изображения
        person_bytes = _image_bytes(abs_user_path)
        clothes_bytes = _image_bytes(abs_product_path)


        BASE_PROMPT = (
            "Надень одежду с изображения №2 на человека с изображения №1. "
            "Подгони масштаб/поворот, сохрани лицо, сохрани позу человека и пропорции. Естественный свет. "
            "Не возвращай мне никогда текст, только картинку ОБЯЗАТЕЛЬНО. "
        )

        if prompt_text:
            prompt = BASE_PROMPT + " " + prompt_text
        else:
            prompt = BASE_PROMPT

        print(prompt)
        # Собираем запрос
        parts = [
            types.Part.from_bytes(data=person_bytes, mime_type="image/jpeg"),
            types.Part.from_bytes(data=clothes_bytes, mime_type="image/png"),
            prompt,
        ]

        # Отправляем запрос в модель
        resp = client.models.generate_content(
            model=GEMINI_IMAGE_MODEL,
            contents=parts,
        )

        # Ищем картинку в ответе
        for cand in resp.candidates:
            for part in cand.content.parts:
                if getattr(part, "inline_data", None) and part.inline_data.data:
                    img = Image.open(BytesIO(part.inline_data.data)).convert("RGBA")
                    out = BytesIO()
                    img.save(out, format="PNG")
                    print("[INFO] Примерка успешно выполнена.")
                    return out.getvalue()

        # Если дошли сюда — Gemini не вернул изображение
        raise RuntimeError("Gemini вернул только текст или пустой ответ.")

    except Exception as e:
        print("[ERROR] Ошибка при работе с Gemini:")
        traceback.print_exc()
        raise RuntimeError(f"Ошибка во время генерации: {e}")

    finally:
        # Удаляем временное фото пользователя (даже если произошла ошибка)
        _safe_delete(abs_user_path)
