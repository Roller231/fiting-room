# app/routers/users.py
# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from datetime import datetime

from ..models import User
from ..schemas import UserCreate, UserOut, UserUpdate, ExistsOut
from ..deps import db_session

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=UserOut)
async def create_user(data: UserCreate, db: AsyncSession = Depends(db_session)):
    if await db.get(User, data.tg_id):
        raise HTTPException(400, "User already exists")

    obj = User(
        tg_id=data.tg_id,
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        photo_url=data.photo_url,
        language_code=data.language_code,
        can_send_count=data.can_send_count,
        isPremium=data.isPremium,
        isBlocked=data.isBlocked,
        balance=data.balance,
        deposits_total=data.deposits_total,
    )
    db.add(obj)
    await db.commit()

    # 🔥 ВАЖНО: перечитываем объект
    obj = await db.get(User, data.tg_id)
    return obj


@router.post("/upsert", response_model=UserOut)
async def upsert_user(data: UserCreate, db: AsyncSession = Depends(db_session)):
    obj = await db.get(User, data.tg_id)

    if obj:
        obj.username = data.username
        obj.first_name = data.first_name
        obj.last_name = data.last_name
        obj.photo_url = data.photo_url
        obj.language_code = data.language_code
        obj.lastLoginAt = datetime.utcnow()

        await db.commit()

        # 🔥 КЛЮЧЕВО
        obj = await db.get(User, data.tg_id)
        return obj

    obj = User(
        tg_id=data.tg_id,
        username=data.username,
        first_name=data.first_name,
        last_name=data.last_name,
        photo_url=data.photo_url,
        language_code=data.language_code,
    )
    db.add(obj)
    await db.commit()

    # 🔥 КЛЮЧЕВО
    obj = await db.get(User, data.tg_id)
    return obj



@router.get("", response_model=List[UserOut])
async def list_users(
    limit: int = 100,
    offset: int = 0,
    db: AsyncSession = Depends(db_session),
):
    res = await db.execute(select(User).limit(limit).offset(offset))
    return res.scalars().all()


@router.get("/{tg_id}", response_model=UserOut)
async def get_user(tg_id: int, db: AsyncSession = Depends(db_session)):
    obj = await db.get(User, tg_id)
    if not obj:
        raise HTTPException(404, "User not found")
    return obj

@router.patch("/{tg_id}", response_model=UserOut)
async def update_user(
    tg_id: int,
    data: UserUpdate,
    db: AsyncSession = Depends(db_session),
):
    obj = await db.get(User, tg_id)
    if not obj:
        raise HTTPException(404, "User not found")

    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(obj, field, value)

    obj.lastLoginAt = datetime.utcnow()

    await db.commit()
    await db.refresh(obj)
    return obj


@router.delete("/{tg_id}", status_code=204)
async def delete_user(tg_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(User).where(User.tg_id == tg_id))
    if res.rowcount == 0:
        raise HTTPException(404, "User not found")
    await db.commit()
    return

@router.get("/{tg_id}/exists", response_model=ExistsOut)
async def exists_user(tg_id: int, db: AsyncSession = Depends(db_session)):
    return ExistsOut(exists=bool(await db.get(User, tg_id)))
