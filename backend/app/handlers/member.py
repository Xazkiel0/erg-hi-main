from fastapi import HTTPException, status
from pydantic import UUID4
from sqlalchemy.orm import Session
from sqlalchemy import or_, func

from app import models, schemas
from app.handlers import image

member_model = models.Member


def show_members(db: Session, query, page, limit):
    like_query = func.lower('%{}%'.format(query))

    total_count = (
        db.query(member_model)
        .where(
            (
                or_(
                    func.lower(member_model.name).like(like_query),
                    func.lower(member_model.nip).like(like_query),
                    func.lower(member_model.email).like(like_query),
                    func.lower(member_model.google_scholar).like(like_query),
                    func.lower(member_model.status).like(like_query),
                )
            )
        )
        .count()
    )
    has_more = (page * limit) < total_count

    if limit <= 0:
        return {
            "data": (
                db.query(member_model).where(
                    (
                        or_(
                            func.lower(member_model.name).like(like_query),
                            func.lower(member_model.nip).like(like_query),
                            func.lower(member_model.email).like(like_query),
                            func.lower(member_model.google_scholar).like(like_query),
                            func.lower(member_model.status).like(like_query),
                        )
                    )
                )
            )
        }
    else:
        return {
            "data": db.query(member_model)
            .where(
                (
                    or_(
                        func.lower(member_model.name).like(like_query),
                        func.lower(member_model.nip).like(like_query),
                        func.lower(member_model.email).like(like_query),
                        func.lower(member_model.google_scholar).like(like_query),
                        func.lower(member_model.status).like(like_query),
                    )
                )
            )
            .offset((page - 1) * limit)
            .limit(limit)
            .all(),
            "total": total_count,
            "has_more": has_more,
        }


def show_member(id: UUID4, db: Session):
    member = db.query(member_model).filter(member_model.id == id).first()

    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {id} is not found",
        )

    return member


def create_member(request: schemas.MemberRequest, db: Session):
    new_member = member_model(
        name=request.name,
        nip=request.nip,
        email=request.email,
        google_scholar=request.google_scholar,
        status=request.status,
        filename=request.filename,
    )

    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return new_member


def edit_member(id: UUID4, request: schemas.MemberRequest, db: Session):
    edited_member = request.dict(exclude_unset=True)
    member = db.query(member_model).filter(member_model.id == id)

    if not member.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {id} is not found",
        )

    member.update(edited_member, synchronize_session=False)
    db.commit()

    return {"detail": "Member was updated"}


def delete_member(id: UUID4, db: Session):
    member = db.query(member_model).filter(member_model.id == id)

    if not member.first():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Member with id {id} is not found",
        )

    filename = member.first().filename
    image.delete_image(filename)

    member.delete(synchronize_session=False)
    db.commit()

    return {"detail": "Member was deleted"}
