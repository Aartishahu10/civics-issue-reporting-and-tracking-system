import os
from uuid import uuid4
from werkzeug.utils import secure_filename

from config import Config

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}


def save_uploaded_file(file_storage):
    if file_storage is None or file_storage.filename == '':
        return None

    filename = secure_filename(file_storage.filename)
    ext = filename.rsplit('.', 1)[1].lower() if '.' in filename else ''
    if ext not in ALLOWED_EXTENSIONS:
        raise ValueError('Unsupported file type. Please upload a JPG, PNG, or WEBP image.')

    upload_dir = os.path.join(os.getcwd(), Config.UPLOAD_FOLDER)
    os.makedirs(upload_dir, exist_ok=True)

    unique_name = f"{uuid4().hex}.{ext}"
    full_path = os.path.join(upload_dir, unique_name)
    file_storage.save(full_path)
    return f"/uploads/{unique_name}"
