from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.mongo import close_mongo, init_mongo
from app.routes import router


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup
    await init_mongo()
    yield
    # Shutdown
    await close_mongo()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan,
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
