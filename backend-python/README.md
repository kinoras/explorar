# Explore Hong Kong & Macau - Python Backend

This is the backend application (Python version) for Explore Hong Kong & Macau.

## 🛠 Project setup

### Installation

This project uses [uv](https://docs.astral.sh/uv/) as the package manager.

1.  Clone the repository.

2.  Navigate to this directory: `cd backend-python`

3.  Install dependencies: `uv sync`

### Environment Settings

Set the following environment variable:

- `CORS_ORIGINS` – Comma-separated list of allowed CORS origins
- `MONGO_CONNECTION_STRING` – MongoDB connection string
- `MONGO_DATABASE` – MongoDB database name
- `GOOGLE_MAPS_API_KEY` – Google Maps API key
- `MODEL_PROVIDER` – LLM provider: choose between `openai` and `gemini`
- `OPENAI_API_KEY` – OpenAI API key (if using ChatGPT)
- `OPENAI_MODEL` – OpenAI model name
- `GEMINI_API_KEY` – Gemini API key (if using Gemini)
- `GEMINI_MODEL` – Gemini model name

### Commands

| Command              | Description                                      |
| :------------------- | :----------------------------------------------- |
| `uv run main.py`     | Start the dev server at `http://localhost:8000`. |
| `uv run pytest`      | Run the test suite.                              |
| `uv run ruff check`  | Run the Ruff linter.                             |
| `uv run ruff format` | Run the Ruff formatter.                          |

### Docs

When the application is running, you can access the documentation at:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc
- **OAS:** http://localhost:8000/api/v1/openapi.json
