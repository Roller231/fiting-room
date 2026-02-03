# app/schemas.py
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

# --- Shops ---
class ShopBase(BaseModel):
    name: str
    imageUrl: Optional[str] = None
    description: Optional[str] = None


class ShopCreate(ShopBase): pass
class ShopUpdate(BaseModel):
    name: Optional[str] = None
    imageUrl: Optional[str] = None
    description: Optional[str] = None


class ShopOut(ShopBase):
    id: int
    class Config:
        from_attributes = True


# --- Categories ---
class CategoryBase(BaseModel):
    name: str
    type: Optional[str] = None
    imageUrl: Optional[str] = None   # 👈 ДОБАВИТЬ
    parent_id: Optional[int] = None

class CategoryCreate(CategoryBase): pass
class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    type: Optional[str] = None
    imageUrl: Optional[str] = None   # 👈 ДОБАВИТЬ
    parent_id: Optional[int] = None

class CategoryOut(CategoryBase):
    id: int
    class Config: from_attributes = True


class CategoryTreeOut(CategoryOut):
    children: List["CategoryTreeOut"] = Field(default_factory=list)

# --- Products ---
class ProductBase(BaseModel):
    name: str
    price: float = 0.0
    prompt: Optional[str] = None

    gif: Optional[str] = None              # 👈 НОВОЕ
    marketplace_url: Optional[str] = None  # 👈 НОВОЕ

    category_id: int
    shop_id: int
    razdel_id: Optional[int] = None



class ProductCreate(ProductBase): pass
class ProductUpdate(BaseModel):
    name: Optional[str] = None
    price: Optional[float] = None
    prompt: Optional[str] = None

    gif: Optional[str] = None               # 👈 НОВОЕ
    marketplace_url: Optional[str] = None   # 👈 НОВОЕ

    category_id: Optional[int] = None
    shop_id: Optional[int] = None
    razdel_id: Optional[int] = None

class ProductOut(ProductBase):
    id: int
    photo: str
    class Config: from_attributes = True

# --- Users ---
class UserBase(BaseModel):
    tg_id: int = Field(..., description="Telegram ID как PK")
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    photo_url: Optional[str] = None
    language_code: Optional[str] = None

    can_send_count: int = 0
    isPremium: bool = False
    isBlocked: bool = False

    balance: Decimal = 0
    deposits_total: Decimal = 0



class UserCreate(UserBase): pass
class UserUpdate(BaseModel):
    username: Optional[str] = None
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    photo_url: Optional[str] = None
    language_code: Optional[str] = None

    can_send_count: Optional[int] = None
    isPremium: Optional[bool] = None
    isBlocked: Optional[bool] = None
    balance: Optional[Decimal] = None



class UserOut(UserBase):
    dateReg: datetime
    lastLoginAt: Optional[datetime] = None

    class Config:
        from_attributes = True



# --- Commons ---
class ExistsOut(BaseModel):
    exists: bool

# РАЗДЕЛЫ
class RazdelBase(BaseModel):
    name: str
    isPremium: bool = False
    imageUrl: Optional[str] = None     # 👈 Добавлено

class RazdelCreate(RazdelBase):
    pass

class RazdelUpdate(BaseModel):
    name: Optional[str] = None
    isPremium: Optional[bool] = None
    imageUrl: Optional[str] = None     # 👈 Добавлено

class RazdelOut(RazdelBase):
    id: int
    class Config:
        from_attributes = True

