from wtforms.fields import FileField
from fastapi import Request
import requests

API_UPLOAD_URL = "http://localhost:8000/upload/"


class ImageUploadMixin:
    """
    Добавляет в админку поле 'image_upload'
    и сохраняет путь в поле модели (imageUrl / photo)
    """

    form_extra_fields = {
        "image_upload": FileField("Upload image")
    }

    image_field_name = "imageUrl"
    upload_dir = "default"

    async def on_model_change(
        self,
        data: dict,
        model,
        is_created: bool,
        request: Request,
    ):
        form = data  # sqladmin передаёт form-data как dict

        file = form.get("image_upload")

        if file:
            files = {
                "file": (file.filename, file.file.read(), file.content_type)
            }
            data_payload = {
                "target_dir": self.upload_dir
            }

            response = requests.post(
                API_UPLOAD_URL,
                files=files,
                data=data_payload,
                timeout=30,
            )

            if response.status_code != 200:
                raise Exception(response.text)

            path = response.json()["path"]
            setattr(model, self.image_field_name, path)

        # ⚠️ ОБЯЗАТЕЛЬНО передаём request дальше
        return await super().on_model_change(
            data, model, is_created, request
        )


class ProductUploadMixin:
    """
    Для Product: два поля загрузки — photo (обязательно) и gif (опционально)
    """

    form_extra_fields = {
        "photo_upload": FileField("Upload photo"),
        "gif_upload": FileField("Upload gif (optional)"),
    }

    async def on_model_change(
        self,
        data: dict,
        model,
        is_created: bool,
        request: Request,
    ):
        form = data

        # Загрузка основного фото (обязательно)
        photo_file = form.get("photo_upload")
        if photo_file:
            files = {
                "file": (photo_file.filename, photo_file.file.read(), photo_file.content_type)
            }
            data_payload = {"target_dir": "products"}
            response = requests.post(API_UPLOAD_URL, files=files, data=data_payload, timeout=30)
            if response.status_code != 200:
                raise Exception(f"Photo upload failed: {response.text}")
            model.photo = response.json()["path"]
        elif is_created:
            raise Exception("Photo is required for new product")

        # Загрузка GIF (опционально)
        gif_file = form.get("gif_upload")
        if gif_file:
            files = {
                "file": (gif_file.filename, gif_file.file.read(), gif_file.content_type)
            }
            data_payload = {"target_dir": "products"}
            response = requests.post(API_UPLOAD_URL, files=files, data=data_payload, timeout=30)
            if response.status_code != 200:
                raise Exception(f"GIF upload failed: {response.text}")
            model.gif = response.json()["path"]

        return await super().on_model_change(data, model, is_created, request)
