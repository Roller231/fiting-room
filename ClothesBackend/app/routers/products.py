# app/routers/products.py
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from ..models import Product
from ..schemas import ProductCreate, ProductOut, ProductUpdate, ExistsOut
from ..deps import db_session
from ..utils import save_upload_to, PRODUCTS_DIR, MEDIA_ROOT

router = APIRouter(prefix="/products", tags=["Products"])

@router.post("", response_model=ProductOut)
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category_id: int = Form(...),
    shop_id: int = Form(...),
    razdel_id: int | None = Form(None),  # 👈 Новое поле
    prompt: str | None = Form(None),

        marketplace_url: str | None = Form(None),  # 👈 НОВОЕ
        gif: UploadFile | None = File(None),  # 👈 НОВОЕ
    photo: UploadFile = File(...),
    db: AsyncSession = Depends(db_session),
):
    data = await photo.read()
    rel = save_upload_to(PRODUCTS_DIR, photo.filename, data)
    gif_path = None
    if gif:
        gif_data = await gif.read()
        gif_path = save_upload_to(PRODUCTS_DIR, gif.filename, gif_data)

    obj = Product(
        name=name,
        price=price,
        category_id=category_id,
        shop_id=shop_id,
        razdel_id=razdel_id,
        prompt=prompt,
        photo=str(rel),

        gif=str(gif_path) if gif_path else None,
        marketplace_url=marketplace_url,
    )

    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("", response_model=List[ProductOut])
async def list_products(limit: int = 100, offset: int = 0, db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Product).limit(limit).offset(offset))
    return res.scalars().all()

@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: int, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Product, product_id)
    if not obj:
        raise HTTPException(404, "Product not found")
    return obj

@router.patch("/{product_id}", response_model=ProductOut)
async def update_product(product_id: int, data: ProductUpdate, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Product, product_id)
    if not obj:
        raise HTTPException(404, "Product not found")
    obj.name = data.name
    obj.price = data.price
    obj.prompt = data.prompt
    obj.category_id = data.category_id
    obj.shop_id = data.shop_id
    obj.razdel_id = data.razdel_id  # 👈 Добавляем

    obj.gif = data.gif
    obj.marketplace_url = data.marketplace_url
    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/{product_id}", status_code=204)
async def delete_product(product_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(Product).where(Product.id == product_id))
    if res.rowcount == 0:
        raise HTTPException(404, "Product not found")
    await db.commit()
    return

@router.get("/{product_id}/exists", response_model=ExistsOut)
async def exists_product(product_id: int, db: AsyncSession = Depends(db_session)):
    return ExistsOut(exists=bool(await db.get(Product, product_id)))
