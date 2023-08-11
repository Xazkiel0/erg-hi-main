from fastapi import HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session
from app import models, schemas
from app.handlers import image

contact_us_model = models.ContactUs


def create_contact_us(request: schemas.ContactUsRequest, db: Session):
    new_contact_us = contact_us_model(
        name=request.name,
        filename=request.filename,
        link=request.link,
    )
    db.add(new_contact_us)
    db.commit()
    db.refresh(new_contact_us)

    return new_contact_us


def show_contact_uses(db: Session):
    return db.query(contact_us_model).all()


def show_contact_us(id: UUID4, db: Session):
    contact_us = db.query(contact_us_model).filter(contact_us_model.id == id).first()

    if not contact_us:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact Us with id {id} is not found",
        )

    return contact_us


def edit_contact_us(id: UUID4, request: schemas.ContactUsRequest, db: Session):
    edited_contact_us = request.dict(exclude_unset=True)
    contact_us = db.query(contact_us_model).filter(contact_us_model.id == id)

    if not contact_us.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact Us with id {id} is not found",
        )

    contact_us.update(edited_contact_us, synchronize_session=False)
    db.commit()

    return {"detail": "Contact Us was updated"}


def delete_contact_us(id: UUID4, db: Session):
    contact_us = db.query(contact_us_model).filter(contact_us_model.id == id)

    if not contact_us.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Contact Us with id {id} is not found",
        )

    filename = contact_us.first().filename
    image.delete_image(filename)

    contact_us.delete(synchronize_session=False)
    db.commit()

    return {"detail": "Contact Us was deleted"}
