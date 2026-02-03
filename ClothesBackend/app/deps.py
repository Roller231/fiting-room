# app/deps.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from .database import get_session

async def db_session(session: AsyncSession = Depends(get_session)) -> AsyncSession:
    return session
