# app/main.py
from uuid import uuid4

from fastapi import FastAPI, Depends, UploadFile, File, Form, HTTPException
from fastapi.responses import Response
from fastapi.staticfiles import StaticFiles
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

from .database import engine, get_session
from .models import Base, Product
from .utils import ensure_dirs, save_upload_to, UPLOADS_DIR, MEDIA_ROOT, TRYON_DIR
from .routers import shops, categories, users, products, razdels, upload
from .services.try_on import run_try_on

from sqladmin import Admin
from .admin_views import (
    ProductAdmin,
    CategoryAdmin,
    ShopAdmin,
    UserAdmin,
    RazdelAdmin,
)
import sys
import os

# Получаем абсолютный путь к папке bot
current_dir = os.path.dirname(os.path.abspath(__file__))
bot_dir = os.path.join(current_dir, "bot")

# Добавляем и app, и app/bot в пути поиска
if current_dir not in sys.path:
    sys.path.append(current_dir)
if bot_dir not in sys.path:
    sys.path.append(bot_dir)



# Теперь везде в коде main.py используйте bot_module.bot вместо bot
# Либо сделайте так:
try:
    from bot.bot import bot as tg_bot
except ImportError:
    from .bot.bot import bot as tg_bot

# Теперь в функциях используйте tg_bot.send_photo(...)

load_dotenv()

app = FastAPI(title="Try-On API", version="1.0.0")

admin = Admin(app, engine)

admin.add_view(ProductAdmin)
admin.add_view(CategoryAdmin)
admin.add_view(ShopAdmin)
admin.add_view(UserAdmin)
admin.add_view(RazdelAdmin)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Можно указать конкретные домены
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Статика (выдача файлов из MEDIA_ROOT)
ensure_dirs()
app.mount("/media", StaticFiles(directory=str(MEDIA_ROOT)), name="media")

# Подключаем CRUD роутеры
app.include_router(shops.router)
app.include_router(categories.router)
app.include_router(users.router)
app.include_router(products.router)
app.include_router(razdels.router)
app.include_router(upload.router)






@app.on_event("startup")
async def on_startup():
    # создаём таблицы при старте (для простоты; в проде лучше Alembic)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/health")
async def health(db: AsyncSession = Depends(get_session)):
    await db.execute(text("SELECT 1"))
    return {"status": "ok"}

# --- Виртуальная примерка ---
@app.post("/try-on")
async def try_on(
        product_id: int = Form(...),
        user_photo: UploadFile = File(...),
        tg_id: int | None = Form(None),  # Необязательный ID
        db: AsyncSession = Depends(get_session),
):
    data = await user_photo.read()
    if not data:
        raise HTTPException(400, "Empty file")

    rel_user = save_upload_to(UPLOADS_DIR, user_photo.filename, data)
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(404, "Product not found")

    try:
        result_png = run_try_on(
            user_photo_path=rel_user,
            product_photo_path=product.photo,
            prompt_text=product.prompt,
        )

        # ОТПРАВКА В ТГ (фоновая задача, чтобы не тормозить ответ API)
        if tg_id:
            import asyncio
            asyncio.create_task(send_result_to_tg(tg_id, result_png))

    except Exception as e:
        raise HTTPException(500, f"Try-on failed: {e}")

    file_name = f"{uuid4()}.png"
    output_path = TRYON_DIR / file_name
    with open(output_path, "wb") as f:
        f.write(result_png)

    return {"url": f"/media/tryon/{file_name}"}


@app.post("/try-on/raw")
async def try_on_raw(
        person_photo: UploadFile = File(...),
        clothes_photo: UploadFile = File(...),
        prompt: str | None = Form(None),
        tg_id: int | None = Form(None),  # Необязательный ID
):
    person_data = await person_photo.read()
    clothes_data = await clothes_photo.read()

    rel_person = save_upload_to(UPLOADS_DIR, f"p_{uuid4()}.jpg", person_data)
    rel_clothes = save_upload_to(UPLOADS_DIR, f"c_{uuid4()}.jpg", clothes_data)

    try:
        result_png = run_try_on(
            user_photo_path=rel_person,
            product_photo_path=rel_clothes,
            prompt_text=prompt,
        )

        # ОТПРАВКА В ТГ
        if tg_id:
            import asyncio
            asyncio.create_task(send_result_to_tg(tg_id, result_png))

    except Exception as e:
        raise HTTPException(500, f"Try-on failed: {e}")

    file_name = f"{uuid4()}.png"
    out_path = TRYON_DIR / file_name
    with open(out_path, "wb") as f:
        f.write(result_png)

    return {"url": f"/media/tryon/{file_name}"}

#uvicorn main:app --reload






# --- Функция-помощник для отправки в ТГ ---
async def send_result_to_tg(tg_id: int, image_bytes: bytes):
    try:
        from aiogram.types import BufferedInputFile

        photo = BufferedInputFile(image_bytes, filename="result.png")

        await tg_bot.send_photo(
            chat_id=tg_id,
            photo=photo,
            caption=(
                "<b>Ваш образ готов!</b> ✨\n\n"
                "Нравится результат? Попробуйте примерить что-нибудь еще!"
            ),
            parse_mode="HTML"
        )
    except Exception as e:
        print(f"Ошибка отправки в ТГ: {e}")
