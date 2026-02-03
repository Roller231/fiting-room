# app/utils.py
import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

MEDIA_ROOT = Path(os.getenv("MEDIA_ROOT", "media")).resolve()
PRODUCTS_DIR = MEDIA_ROOT / os.getenv("PRODUCTS_DIR", "products")
UPLOADS_DIR  = MEDIA_ROOT / os.getenv("UPLOADS_DIR", "uploads")
TRYON_DIR = MEDIA_ROOT / "tryon"
RAZDELS_DIR = MEDIA_ROOT / "RazdelIcon"
SHOPS_DIR = MEDIA_ROOT / "ShopsIcon"

def ensure_dirs():
    PRODUCTS_DIR.mkdir(parents=True, exist_ok=True)
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    TRYON_DIR.mkdir(parents=True, exist_ok=True)
    RAZDELS_DIR.mkdir(parents=True, exist_ok=True)
    SHOPS_DIR.mkdir(parents=True, exist_ok=True)


def save_upload_to(dirpath: Path, filename: str, data: bytes) -> str:
    dirpath.mkdir(parents=True, exist_ok=True)
    safe_name = filename.replace("/", "_")
    full = dirpath / safe_name
    with open(full, "wb") as f:
        f.write(data)
    # Возвращаем относительный путь от MEDIA_ROOT
    return str(full.relative_to(MEDIA_ROOT))

def abs_media_path(rel_path: str) -> Path:
    return (MEDIA_ROOT / rel_path).resolve()
