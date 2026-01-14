# Automation Scripts

This directory contains various automation scripts for **Explore Hong Kong & Macau**, including data generation and management tools.

## 🛠 Setup

### Prerequisite

This project uses [uv](https://docs.astral.sh/uv/) for Python package management.

1.  Navigate to this directory: `cd scripts`

2.  Install dependencies: `uv sync`

### Environment Settings

Create a `.env` file in the `scripts` directory and specify the following variables:

- `TRIPADVISOR_API_KEY`: API key for Tripadvisor content.
- `OPENAI_API_KEY`: (Optional) API key for generating missing descriptions using OpenAI.

## 🤖 Scripts

### Tripadvisor Data Generator

- **Script:** `generator/tripadvisor.py`

- **Usage:**

  - Fetches place details and photos from Tripadvisor API and generates standardized JSON files for the backend.
  - Uses OpenAI to fill in missing descriptions if available.

- **Arguments:**

  | Option           | Description                                                                          |
  | :--------------- | :----------------------------------------------------------------------------------- |
  | `-o`, `--output` | Destination directory for the generated JSON files (e.g., `../backend/Data/places`). |
  | `-p`, `--places` | List of Tripadvisor Location IDs to process (separated by space).                    |

- **Output:** Files are generated in the format `place_[id]{*#%}.json`. The suffixes indicate:
  - **`*`:** Not yet manually verified; data may be incorrect.
  - **`#`:** Missing description (not found in Tripadvisor + OpenAI generation failed).
  - **`%`:** Missing region information (mapping failed).
