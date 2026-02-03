# app/routers/shops.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from ..models import Shop
from ..schemas import ShopCreate, ShopOut, ShopUpdate, ExistsOut
from ..deps import db_session

router = APIRouter(prefix="/shops", tags=["Shops"])

@router.post("", response_model=ShopOut)
async def create_shop(data: ShopCreate, db: AsyncSession = Depends(db_session)):
    shop = Shop(
        name=data.name,
        imageUrl=data.imageUrl,
        description=data.description,
    )
    db.add(shop)
    await db.commit()
    await db.refresh(shop)
    return shop


@router.get("", response_model=List[ShopOut])
async def list_shops(limit: int = 100, offset: int = 0, db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Shop).limit(limit).offset(offset))
    return res.scalars().all()

@router.get("/{shop_id}", response_model=ShopOut)
async def get_shop(shop_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.get(Shop, shop_id)
    if not res:
        raise HTTPException(404, "Shop not found")
    return res

@router.patch("/{shop_id}", response_model=ShopOut)
async def update_shop(shop_id: int, data: ShopUpdate, db: AsyncSession = Depends(db_session)):
    shop = await db.get(Shop, shop_id)
    if not shop:
        raise HTTPException(404, "Shop not found")

    if data.name is not None:
        shop.name = data.name

    if data.imageUrl is not None:
        shop.imageUrl = data.imageUrl

    if data.description is not None:
        shop.description = data.description

    await db.commit()
    await db.refresh(shop)
    return shop


@router.delete("/{shop_id}", status_code=204)
async def delete_shop(shop_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(Shop).where(Shop.id == shop_id))
    if res.rowcount == 0:
        raise HTTPException(404, "Shop not found")
    await db.commit()
    return

@router.get("/{shop_id}/exists", response_model=ExistsOut)
async def exists_shop(shop_id: int, db: AsyncSession = Depends(db_session)):
    return ExistsOut(exists=bool(await db.get(Shop, shop_id)))
