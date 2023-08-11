from fastapi import APIRouter, Depends, status
from pydantic import UUID4
from sqlalchemy.orm import Session

from app import oauth2

from ..handlers import member
from .. import schemas, db

get_db = db.get_db

router = APIRouter(prefix="/members", tags=["Members"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.MemberRequest,
    db: Session = Depends(get_db),
    current_user: schemas.UserRequest = Depends(oauth2.get_current_user),
):
    return member.create_member(request, db)


@router.get("/", status_code=status.HTTP_200_OK)
def index(query: str = '', page: int = 1, limit: int = 10, db: Session = Depends(get_db)):
    return member.show_members(db, query, page, limit)

@router.get("/{id}/", status_code=status.HTTP_200_OK)
def show_by_id(id: UUID4, db: Session = Depends(get_db)):
    return member.show_member(id, db)


@router.put("/{id}/", status_code=status.HTTP_202_ACCEPTED)
def update(
    id: UUID4,
    request: schemas.MemberRequest,
    db: Session = Depends(get_db),
    current_user: schemas.UserRequest = Depends(oauth2.get_current_user),
):
    return member.edit_member(id, request, db)


@router.delete("/{id}/", status_code=status.HTTP_200_OK)
def destroy(
    id: UUID4,
    db: Session = Depends(get_db),
    current_user: schemas.UserRequest = Depends(oauth2.get_current_user),
):
    return member.delete_member(id, db)
