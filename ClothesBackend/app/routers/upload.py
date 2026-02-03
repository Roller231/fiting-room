from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pathlib import Path
from uuid import uuid4

from ..utils import (
    MEDIA_ROOT,
    PRODUCTS_DIR,
    UPLOADS_DIR,
    TRYON_DIR,
    RAZDELS_DIR,
    SHOPS_DIR,
    save_upload_to,
)

router = APIRouter(prefix="/upload", tags=["Upload"])


# Какие папки доступны
DIR_MAP = {
    "products": PRODUCTS_DIR,
    "uploads": UPLOADS_DIR,
    "tryon": TRYON_DIR,
    "razdels": RAZDELS_DIR,
    "shops": SHOPS_DIR,
}


@router.get("/dirs")
async def get_available_dirs():
    """Вернёт список доступных директорий."""
    return {"allowed_dirs": list(DIR_MAP.keys())}


@router.post("/")
async def upload_file(
    target_dir: str = Form(...),
    file: UploadFile = File(...),
):
    """
    Универсальная загрузка файлов во все каталоги.
    """
    if target_dir not in DIR_MAP:
        raise HTTPException(
            400, f"Invalid target_dir. Allowed: {list(DIR_MAP.keys())}"
        )

    directory: Path = DIR_MAP[target_dir]

    # читаем файл
    content = await file.read()
    if not content:
        raise HTTPException(400, "Empty file")

    # создаём безопасное имя файла
    ext = file.filename.split(".")[-1]
    safe_name = f"{uuid4()}.{ext}"

    # сохраняем
    rel_path = save_upload_to(directory, safe_name, content)

    # генерируем URL
    url = f"/media/{rel_path}"

    return {
        "status": "success",
        "filename": safe_name,
        "path": rel_path,
        "url": url,
        "target_dir": target_dir,
    }
