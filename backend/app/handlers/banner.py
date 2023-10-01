from fastapi import HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session
from app import models, schemas

banner_model = models.Banner


def create_banner(request: schemas.BannerRequest, db: Session):
    new_banner = banner_model(
        name=request.name,
        filename=request.filename,
    )
    db.add(new_banner)
    db.commit()
    db.refresh(new_banner)

    return new_banner

def show_banner(db: Session):
    banner = db.query(banner_model).first()

    if not banner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Banner with id {id} is not found",
        )

    return banner


def edit_banner(id: UUID4, request: schemas.BannerRequest, db: Session):
    edited_banner = request.dict(exclude_unset=True)
    banner = db.query(banner_model).filter(banner_model.id == id)

    if not banner.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Banner with id {id} is not found",
        )

    banner.update(edited_banner, synchronize_session=False)
    db.commit()

    return {"detail": "Banner was updated"}
