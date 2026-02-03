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
