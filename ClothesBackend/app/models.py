from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy import (
    String,
    Integer,
    Text,
    ForeignKey,
    Float,
    BigInteger,
    Boolean,
    DateTime,
    Numeric,
)
from datetime import datetime
from decimal import Decimal


class Base(DeclarativeBase):
    pass


# =========================
# SHOP
# =========================
class Shop(Base):
    __tablename__ = "shops"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)

    imageUrl: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="shop", cascade="all, delete"
    )

    def __str__(self):
        return self.name


# =========================
# CATEGORY
# =========================
class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    type: Mapped[str | None] = mapped_column(String(100), nullable=True)
    imageUrl: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="category", cascade="all, delete"
    )

    def __str__(self):
        return self.name


# =========================
# RAZDEL
# =========================
class Razdel(Base):
    __tablename__ = "razdels"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), unique=True, nullable=False)
    isPremium: Mapped[bool] = mapped_column(Boolean, default=False)
    imageUrl: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    products: Mapped[list["Product"]] = relationship(
        back_populates="razdel", cascade="all, delete"
    )

    def __str__(self):
        return self.name


# =========================
# PRODUCT
# =========================
class Product(Base):
    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)

    photo: Mapped[str] = mapped_column(String(1024), nullable=False)
    gif: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    marketplace_url: Mapped[str | None] = mapped_column(String(1024), nullable=True)

    price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    prompt: Mapped[str | None] = mapped_column(Text, nullable=True)

    category_id: Mapped[int] = mapped_column(
        ForeignKey("categories.id"), nullable=False
    )
    shop_id: Mapped[int] = mapped_column(
        ForeignKey("shops.id"), nullable=False
    )
    razdel_id: Mapped[int | None] = mapped_column(
        ForeignKey("razdels.id"), nullable=True
    )

    category: Mapped["Category"] = relationship(back_populates="products")
    shop: Mapped["Shop"] = relationship(back_populates="products")
    razdel: Mapped["Razdel"] = relationship(back_populates="products")

    def __str__(self):
        return self.name


# =========================
# USER
# =========================
class User(Base):
    __tablename__ = "users"

    tg_id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    username: Mapped[str | None] = mapped_column(String(255))
    first_name: Mapped[str | None] = mapped_column(String(255))
    last_name: Mapped[str | None] = mapped_column(String(255))
    photo_url: Mapped[str | None] = mapped_column(String(1024))
    language_code: Mapped[str | None] = mapped_column(String(16))

    can_send_count: Mapped[int] = mapped_column(Integer, default=0)
    isPremium: Mapped[bool] = mapped_column(Boolean, default=False)
    isBlocked: Mapped[bool] = mapped_column(Boolean, default=False)

    balance: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)
    deposits_total: Mapped[Decimal] = mapped_column(Numeric(12, 2), default=0)

    dateReg: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=datetime.utcnow,
        nullable=False,
    )

    def __str__(self):
        return self.username or str(self.tg_id)
