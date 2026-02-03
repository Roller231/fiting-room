from sqladmin import ModelView
from .models import Product, Category, Shop, User, Razdel


from .models import Product, Category, Shop, Razdel, User
from .admin_fields import ImageUploadMixin


class ProductAdmin(ImageUploadMixin, ModelView, model=Product):
    name = "Product"
    name_plural = "Products"

    image_field_name = "photo"
    upload_dir = "products"

    column_list = [
        Product.id,
        Product.name,
        Product.price,
        Product.category,   # 🔥 имя категории
        Product.shop,       # 🔥 имя магазина
        Product.razdel,     # 🔥 имя раздела
        Product.photo,
        Product.gif,

        Product.marketplace_url
    ]

    form_columns = [
        Product.name,
        Product.category,
        Product.shop,
        Product.razdel,
        Product.price,
        Product.photo,
        Product.gif,

        Product.marketplace_url

    ]



class CategoryAdmin(ModelView, model=Category):
    name = "Category"
    name_plural = "Categories"
    column_list = [Category.id, Category.name, Category.imageUrl]


class ShopAdmin(ImageUploadMixin, ModelView, model=Shop):



    name = "Shop"
    name_plural = "Shops"

    image_field_name = "imageUrl"
    upload_dir = "shops"

    column_list = [
        Shop.id,
        Shop.name,
        Shop.imageUrl,
        Shop.description,
    ]



class RazdelAdmin(ImageUploadMixin, ModelView, model=Razdel):
    name = "Razdel"
    name_plural = "Razdels"

    image_field_name = "imageUrl"
    upload_dir = "razdels"

    column_list = [
        Razdel.id,
        Razdel.name,
        Razdel.isPremium,
        Razdel.imageUrl,
    ]



class UserAdmin(ModelView, model=User):
    name = "User"
    name_plural = "Users"
    column_list = [
        User.tg_id,
        User.username,
        User.first_name,
        User.can_send_count,
        User.isPremium,
    ]
