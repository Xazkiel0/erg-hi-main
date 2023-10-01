from fastapi import APIRouter, Depends, status
from pydantic import UUID4
from sqlalchemy.orm import Session
from ..handlers import banner
from .. import db, schemas, oauth2

get_db = db.get_db

router = APIRouter(prefix="/banner", tags=["Banner"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def create(
    request: schemas.BannerRequest,
    db: Session = Depends(get_db),
    current_user: schemas.UserRequest = Depends(oauth2.get_current_user),
):
    return banner.create_banner(request, db)


@router.get("/", status_code=status.HTTP_200_OK)
def index(db: Session = Depends(get_db)):
    return banner.show_banner(db)


@router.put("/{id}", status_code=status.HTTP_202_ACCEPTED)
def update(
    id: UUID4,
    request: schemas.BannerRequest,
    db: Session = Depends(get_db),
    current_user: schemas.UserRequest = Depends(oauth2.get_current_user),
):
    return banner.edit_banner(id, request, db)
