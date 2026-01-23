"""
This module defines custom exception response models and handlers for the FastAPI application.
"""

from typing import Literal, Optional

from http import HTTPStatus
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel


# Response models
class ErrorResponseModel(BaseModel):
    code: int
    status: Literal["error"] = "error"
    message: str
    description: Optional[str] = None


class NotFoundExceptionModel(ErrorResponseModel):
    code: int = 404


class UnprocessableEntityExceptionModel(ErrorResponseModel):
    code: int = 422


class InternalServerErrorExceptionModel(ErrorResponseModel):
    code: int = 500


# JSON response
class ErrorResponse(JSONResponse):
    def __init__(
        self,
        code: int,
        message: str,
        description: Optional[str] = None,
    ):
        super().__init__(
            status_code=code,
            content=ErrorResponseModel(
                code=code,
                message=message,
                description=description,
            ).model_dump(),
        )


async def validation_exception_handler(_: Request, exc: RequestValidationError):
    """
    [422] Handler for request validation errors.
    """
    errors = exc.errors()
    description = "; ".join([f"{err['loc'][-1]}: {err['msg']}" for err in errors])
    return ErrorResponse(
        code=422,
        message="Validation error",
        description=description,
    )


async def http_exception_handler(_: Request, exc: HTTPException):
    """
    [4XX] Handler for general HTTP exceptions.
    """
    status_phrase = HTTPStatus(exc.status_code).phrase
    if isinstance(exc.detail, dict):
        message = exc.detail.get("message") or status_phrase
        description = exc.detail.get("description")
    else:
        message = str(exc.detail) if exc.detail else status_phrase
        description = None

    return ErrorResponse(
        code=exc.status_code,
        message=message,
        description=description,
    )


async def unhandled_exception_handler(_: Request, __: Exception):
    """
    [500] Handler for uncaught exceptions.
    """
    return ErrorResponse(
        code=500,
        message="Internal server error",
        description="An unexpected error occurred",
    )
