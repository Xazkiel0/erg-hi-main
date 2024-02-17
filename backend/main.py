from dotenv import load_dotenv
from sqlalchemy import Column, String
import uvicorn

load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.db import add_column, engine
from app.routers import product, user, auth, about_us, contact_us, image, hero, member, banner

app = FastAPI()

origins = ["http://hi.rg.pens.ac.id"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "HEAD", "DELETE", "PUT", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

# column = Column('website_profile', String)
# add_column(engine, 'members', column)

app.include_router(auth.router)
app.include_router(product.router)
app.include_router(member.router)
app.include_router(image.router)
app.include_router(user.router)
app.include_router(hero.router)
app.include_router(about_us.router)
app.include_router(contact_us.router)
app.include_router(banner.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
