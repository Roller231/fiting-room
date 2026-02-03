from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from ..models import Razdel
from ..schemas import RazdelCreate, RazdelOut, RazdelUpdate
from ..deps import db_session

router = APIRouter(prefix="/razdels", tags=["Razdels"])

@router.post("", response_model=RazdelOut)
async def create_razdel(data: RazdelCreate, db: AsyncSession = Depends(db_session)):
    obj = Razdel(
        name=data.name,
        isPremium=data.isPremium,
        imageUrl=data.imageUrl,    # 👈 новое поле
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj


@router.get("", response_model=List[RazdelOut])
async def list_razdels(db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Razdel))
    return res.scalars().all()

@router.get("/{razdel_id}", response_model=RazdelOut)
async def get_razdel(razdel_id: int, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Razdel, razdel_id)
    if not obj:
        raise HTTPException(404,"Razdel not found")
    return obj

@router.patch("/{razdel_id}", response_model=RazdelOut)
async def update_razdel(razdel_id: int, data: RazdelUpdate, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Razdel, razdel_id)
    if not obj:
        raise HTTPException(404,"Razdel not found")

    if data.name is not None:
        obj.name = data.name
    if data.isPremium is not None:
        obj.isPremium = data.isPremium
    if data.imageUrl is not None:
        obj.imageUrl = data.imageUrl

    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/{razdel_id}", status_code=204)
async def delete_razdel(razdel_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(Razdel).where(Razdel.id == razdel_id))
    if res.rowcount == 0:
        raise HTTPException(404,"Razdel not found")
    await db.commit()
