# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from ..models import Category
from ..schemas import CategoryCreate, CategoryOut, CategoryUpdate, ExistsOut
from ..deps import db_session

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.post("", response_model=CategoryOut)
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(db_session)):
    obj = Category(
        name=data.name,
        type=data.type,
        imageUrl=data.imageUrl,  # 👈 ДОБАВИТЬ
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("", response_model=List[CategoryOut])
async def list_categories(limit: int = 100, offset: int = 0, db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Category).limit(limit).offset(offset))
    return res.scalars().all()

@router.get("/{category_id}", response_model=CategoryOut)
async def get_category(category_id: int, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Category, category_id)
    if not obj:
        raise HTTPException(404, "Category not found")
    return obj

@router.patch("/{category_id}", response_model=CategoryOut)
async def update_category(category_id: int, data: CategoryUpdate, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Category, category_id)
    if not obj:
        raise HTTPException(404, "Category not found")
    obj.name = data.name
    obj.type = data.type
    if data.imageUrl is not None:
        obj.imageUrl = data.imageUrl  # 👈 ДОБАВИТЬ
    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/{category_id}", status_code=204)
async def delete_category(category_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(Category).where(Category.id == category_id))
    if res.rowcount == 0:
        raise HTTPException(404, "Category not found")
    await db.commit()
    return

@router.get("/{category_id}/exists", response_model=ExistsOut)
async def exists_category(category_id: int, db: AsyncSession = Depends(db_session)):
    return ExistsOut(exists=bool(await db.get(Category, category_id)))
