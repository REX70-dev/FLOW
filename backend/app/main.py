from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.db.session import engine, Base

# Create tables for MVP
Base.metadata.create_all(bind=engine)

app = FastAPI(title=settings.PROJECT_NAME, openapi_url=f"{settings.API_V1_STR}/openapi.json")

# Set all CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "Welcome to the Intelligent Multi-Modal AI Learning Platform API"}

from app.api import auth, ingest, tests, revision
app.include_router(auth.router, prefix=settings.API_V1_STR + "/auth", tags=["auth"])
app.include_router(ingest.router, prefix=settings.API_V1_STR + "/ingest", tags=["ingest"])
app.include_router(tests.router, prefix=settings.API_V1_STR + "/tests", tags=["tests"])
app.include_router(revision.router, prefix=settings.API_V1_STR + "/revision", tags=["revision"])
