from typing import Any, Iterable, Optional
from pydantic import BaseModel
from enum import StrEnum
from json import dumps

from http import HTTPStatus
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ErrorCode(StrEnum):
    # GET /categories
    CATEGORIES_REGION_INVALID = "categories.region.invalid"

    # GET /places
    PLACES_REGION_INVALID = "places.region.invalid"
    PLACES_CATEGORY_INVALID = "places.category.invalid"
    PLACES_ORDERBY_INVALID = "places.orderBy.invalid"
    PLACES_ORDERDIR_INVALID = "places.orderDir.invalid"
    PLACES_LIMIT_FORMAT = "places.limit.format"
    PLACES_CURSOR_FORMAT = "places.cursor.format"

    # GET /places/[id]
    PLACE_ID_FORMAT = "place.id.format"
    PLACE_ID_NOTFOUND = "place.id.notFound"

    # POST /routes/compute
    ROUTES_DATE_RANGE = "routes.date.range"
    ROUTES_DATE_FORMAT = "routes.date.format"
    ROUTES_METHOD_INVALID = "routes.method.invalid"
    ROUTES_PLACES_FORMAT = "routes.places.format"
    ROUTES_PLACES_REGIONS = "routes.places.regions"
    ROUTES_PLACES_NOTFOUND = "routes.places.notFound"
    ROUTES_COMPUTE_FAILED = "routes.compute.failed"

    # General
    SERVER_INTERNAL_GENERAL = "server.internal.general"

    # Fallback
    UNKNOWN = "unknown"

    @classmethod
    def _missing_(cls, _):
        return cls.UNKNOWN


##### Response Models #####


def error_models(codes: Iterable[int]) -> dict[int, dict]:
    return {int(code): {"model": ErrorModel} for code in codes}


type ErrorDetails = dict[str, str]


class ErrorModel(BaseModel):
    status: int
    code: ErrorCode = ErrorCode.UNKNOWN
    message: str
    details: Optional[ErrorDetails] = None


class ErrorResponse(JSONResponse):
    def __init__(
        self,
        status: int,
        code: ErrorCode,
        message: str,
        details: Optional[ErrorDetails] = None,
    ):
        super().__init__(
            status_code=status,
            content=ErrorModel(
                status=status,
                code=code,
                message=message,
                details=details,
            ).model_dump(),
        )

    @classmethod
    def from_model(cls, model: ErrorModel) -> "ErrorResponse":
        return cls(
            status=model.status,
            code=model.code,
            message=model.message,
            details=model.details,
        )


##### Exception Handlers #####


async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    [422] Handler for request validation errors.
    """
    errors = exc.errors()
    return ErrorResponse(
        status=422,
        code=_map_validation_error_code(request, errors),
        message="Validation error",
        details=_parse_validation_error_details(errors),
    )


async def http_exception_handler(_: Request, exc: HTTPException):
    """
    [4XX] Handler for general HTTP exceptions.
    """
    status_phrase = HTTPStatus(exc.status_code).phrase

    # Detail already in ErrorModel: Return directly
    if isinstance(exc.detail, ErrorModel):
        return ErrorResponse.from_model(exc.detail)

    # Detail as dict: Extract fields
    if isinstance(exc.detail, dict):
        return ErrorResponse(
            status=exc.status_code,
            code=ErrorCode(exc.detail.get("code")),
            message=exc.detail.get("message") or status_phrase,
            details=_parse_details(exc.detail.get("details")),
        )

    # Fallback: Use stringified detail as message
    return ErrorResponse(
        status=exc.status_code,
        code=ErrorCode.UNKNOWN,
        message=str(exc.detail) if exc.detail else status_phrase,
    )


async def unhandled_exception_handler(_: Request, __: Exception):
    """
    [500] Handler for uncaught exceptions.
    """
    return ErrorResponse(
        status=500,
        code=ErrorCode.SERVER_INTERNAL_GENERAL,
        message="Internal server error",
        details={"error": "An unexpected error occurred"},
    )


##### Utilities #####


def _map_validation_error_code(
    request: Request,
    errors: list[dict[str, Any]] = [],
) -> ErrorCode:
    # Determine request context
    method = request.method.upper()
    path = request.url.path

    # Find code based on validation errors (only first matching error is considered)
    for err in errors:
        loc = err.get("loc", [])
        msg = err.get("msg", "")

        # Skip if current loc cannot be processed
        if not loc or len(loc) < 2:
            continue

        # GET /categories
        if method == "GET" and path == "/categories" and loc[0] == "query":
            if loc[1] == "region":
                return ErrorCode.CATEGORIES_REGION_INVALID

        # GET /places
        if method == "GET" and path == "/places" and loc[0] == "query":
            if loc[1] == "region":
                return ErrorCode.PLACES_REGION_INVALID
            if loc[1] == "orderBy":
                return ErrorCode.PLACES_ORDERBY_INVALID
            if loc[1] == "limit":
                return ErrorCode.PLACES_LIMIT_FORMAT
            if loc[1] == "cursor":
                return ErrorCode.PLACES_CURSOR_FORMAT

        # GET /places/[id]
        if method == "GET" and path.startswith("/places/") and loc[0] == "path":
            if loc[1] == "id":
                return ErrorCode.PLACE_ID_FORMAT

        # POST /routes/compute
        if method == "POST" and path == "/routes/compute" and loc[0] == "body":
            if loc[1] == "date" and "between" in msg:
                return ErrorCode.ROUTES_DATE_RANGE
            if loc[1] == "date":
                return ErrorCode.ROUTES_DATE_FORMAT
            if loc[1] == "places":
                return ErrorCode.ROUTES_PLACES_FORMAT
            if loc[1] in ("mode", "method"):
                return ErrorCode.ROUTES_METHOD_INVALID

    # Fallback: Unknown
    return ErrorCode.UNKNOWN


def _parse_validation_error_details(errors: list[dict[str, Any]]) -> ErrorDetails:
    details: ErrorDetails = {}

    for err in errors:
        # Extract error info
        loc = err.get("loc", [])
        input = err.get("input")
        msg = err.get("msg", "Invalid value")

        # Construct key and value
        key = ".".join(map(str, loc)) if loc else "unknown"
        got = f"Got {dumps(input).replace('"', "'")}. " if input is not None else ""

        # Set detail entry
        details[key] = f"{got}Error: {msg}"

    return details


def _parse_details(details: Any) -> Optional[dict[str, str]]:
    # Dictionary: Convert all keys and values to strings
    if isinstance(details, dict):
        return {str(key): str(value) for key, value in details.items()}
    # Otherwise: Stringify if exists
    return {"error": str(details)} if details else None
