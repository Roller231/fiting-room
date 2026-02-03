# app/routers/categories.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List, Optional, Dict
from ..models import Category, Product
from ..schemas import CategoryCreate, CategoryOut, CategoryUpdate, ExistsOut, CategoryTreeOut
from ..deps import db_session

router = APIRouter(prefix="/categories", tags=["Categories"])


def _build_category_tree(categories: List[Category], allowed_ids: Optional[set[int]] = None) -> List[dict]:
    nodes: Dict[int, dict] = {}
    for c in categories:
        if allowed_ids is not None and c.id not in allowed_ids:
            continue
        nodes[c.id] = {
            "id": c.id,
            "name": c.name,
            "type": c.type,
            "imageUrl": c.imageUrl,
            "parent_id": c.parent_id,
            "children": [],
        }

    roots: List[dict] = []
    for node in nodes.values():
        pid = node.get("parent_id")
        if pid is None or pid not in nodes:
            roots.append(node)
        else:
            nodes[pid]["children"].append(node)
    return roots

@router.post("", response_model=CategoryOut)
async def create_category(data: CategoryCreate, db: AsyncSession = Depends(db_session)):
    obj = Category(
        name=data.name,
        type=data.type,
        imageUrl=data.imageUrl,  # 👈 ДОБАВИТЬ
        parent_id=data.parent_id,
    )
    db.add(obj)
    await db.commit()
    await db.refresh(obj)
    return obj

@router.get("", response_model=List[CategoryOut])
async def list_categories(limit: int = 100, offset: int = 0, db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Category).limit(limit).offset(offset))
    return res.scalars().all()

@router.get("/{category_id:int}", response_model=CategoryOut)
async def get_category(category_id: int, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Category, category_id)
    if not obj:
        raise HTTPException(404, "Category not found")
    return obj

@router.patch("/{category_id:int}", response_model=CategoryOut)
async def update_category(category_id: int, data: CategoryUpdate, db: AsyncSession = Depends(db_session)):
    obj = await db.get(Category, category_id)
    if not obj:
        raise HTTPException(404, "Category not found")
    payload = data.model_dump(exclude_unset=True)
    if "name" in payload:
        obj.name = payload["name"]
    if "type" in payload:
        obj.type = payload["type"]
    if "imageUrl" in payload:
        obj.imageUrl = payload["imageUrl"]
    if "parent_id" in payload:
        obj.parent_id = payload["parent_id"]
    await db.commit()
    await db.refresh(obj)
    return obj

@router.delete("/{category_id:int}", status_code=204)
async def delete_category(category_id: int, db: AsyncSession = Depends(db_session)):
    res = await db.execute(delete(Category).where(Category.id == category_id))
    if res.rowcount == 0:
        raise HTTPException(404, "Category not found")
    await db.commit()
    return

@router.get("/{category_id:int}/exists", response_model=ExistsOut)
async def exists_category(category_id: int, db: AsyncSession = Depends(db_session)):
    return ExistsOut(exists=bool(await db.get(Category, category_id)))


@router.get("/tree", response_model=List[CategoryTreeOut])
async def get_categories_tree(db: AsyncSession = Depends(db_session)):
    res = await db.execute(select(Category))
    cats = res.scalars().all()
    return _build_category_tree(cats)


@router.get("/tree/by-shop/{shop_id}", response_model=List[CategoryTreeOut])
async def get_shop_categories_tree(shop_id: int, db: AsyncSession = Depends(db_session)):
    prod_res = await db.execute(
        select(Product.category_id).where(Product.shop_id == shop_id).distinct()
    )
    category_ids = {row[0] for row in prod_res.all()}
    if not category_ids:
        return []

    cat_res = await db.execute(select(Category))
    cats = cat_res.scalars().all()

    by_id: Dict[int, Category] = {c.id: c for c in cats}
    allowed_ids: set[int] = set(category_ids)
    stack = list(category_ids)
    while stack:
        cid = stack.pop()
        c = by_id.get(cid)
        if not c:
            continue
        pid = c.parent_id
        if pid is not None and pid not in allowed_ids:
            allowed_ids.add(pid)
            stack.append(pid)

    return _build_category_tree(cats, allowed_ids=allowed_ids)
