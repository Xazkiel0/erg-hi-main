import io
import os
import uuid
from PIL import Image
from fastapi import HTTPException, Response, status

from deta import Deta

deta = Deta()

drive = deta.Drive("images")


def check_file_exists(filename):
    return drive.get(filename) is not None


async def upload_image(file, category: str):
    _, ext = os.path.splitext(str(file.filename))
    file.filename = f"{category}-{uuid.uuid4()}{ext}"
    content = await file.read()
    content = compress_image(content, 500)
    
    drive.put(name=file.filename, data=content)

    return {"filename": file.filename}


async def upload_slides(files):
    if len(get_slides()) > 0:
        drive.delete_many(get_slides())

    for file in files:
        _, ext = os.path.splitext(str(file.filename))
        file.filename = f"slide-{uuid.uuid4()}{ext}"
        content = await file.read()
        content = compress_image(content, 500)
    
        drive.put(file.filename, content)

    return {"detail": "Slides were updated"}


def get_slides():
    slides = drive.list()
    try:
        return list(filter(lambda x: x.startswith("slide-"), slides["names"]))
    except:
        return []


def compress_image(file, base_width: int = 360) -> io.BytesIO:
    buffer = io.BytesIO()
    pil_file = Image.open(io.BytesIO(file))

    width_percent = base_width / float(pil_file.size[0])
    hsize = int((float(pil_file.size[1]) * float(width_percent)))
    pil_file = pil_file.resize((base_width, hsize), Image.ADAPTIVE)
    pil_file.save(buffer, format="PNG")
    return buffer


def get_image(filename: str, slides=False):
    file = drive.get(filename)
    content = compress_image(file.read(), 500)
    return Response(content=content.getvalue(), media_type="image/png")


def delete_image(filename):
    if check_file_exists(filename):
        drive.delete(filename)
    else:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Image with name {filename} is not found",
        )

    return {"detail": "File was deleted"}
