from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.exceptions import (
    validation_exception_handler,
    http_exception_handler,
    unhandled_exception_handler,
)
from app.core.mongo import db
from app.features.categories import categories_router
from app.features.places import places_router
from app.features.routing import routing_router
from app.features.itinerary import itinerary_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Startup
    await db.connect()
    yield
    # Shutdown
    await db.close()


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs" if settings.ENVIRONMENT != "production" else None,
    redoc_url="/redoc" if settings.ENVIRONMENT != "production" else None,
    lifespan=lifespan,
)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(Exception, unhandled_exception_handler)

# Routers
app.include_router(categories_router, prefix="/categories", tags=["Categories"])
app.include_router(places_router, prefix="/places", tags=["Places"])
app.include_router(routing_router, prefix="/routes", tags=["Routes"])
app.include_router(itinerary_router, prefix="/itinerary", tags=["Itinerary"])
