# Explore Hong Kong & Macau

This is the backend API for **Explore Hong Kong & Macau**, responsible for serving place data, categories, and generating travel routes between selected locations using Google Routes API.

## 🛠 Project setup

### Requirements

- .NET SDK **9.0+**

- Windows/macOS/Linux

- Google Cloud project with Routes API enabled

- Google Cloud service account credential JSON

### Installation

1. Clone the repository.

2. Navigate to the backend directory: `cd backend`

3. Restore dependencies: `dotnet restore`

4. Run the program: `dotnet run`

    The APIs will be available at: `http://localhost:5019`\

    Swagger UI: `http://localhost:5019/docs`

### Environment Settings

The backend uses the official Google Maps Routes API (V2) via the
Google Cloud .NET SDK. Authentication is handled through Application Default Credentials (ADC).

If you are unfamiliar with ADC, please refer to this link: [Google Cloud](https://docs.cloud.google.com/docs/authentication/set-up-adc-local-dev-environment)

Set the following environment variable:

- `GOOGLE_APPLICATION_CREDENTIALS` – Absolute path to the Google Cloud service account JSON file


#### Windows Powershell

    
    $env:GOOGLE_APPLICATION_CREDENTIALS="C:\example\google-ADC.json"
    
    
#### macOS/Linux

    export GOOGLE_APPLICATION_CREDENTIALS=/example/google-ADC.json


## 📦 Data model & storage
### Place data

- Data of Each place is stored as a single JSON file

- One file per location

- Loaded into memory cache at cold start

- No database is used

\
This approach provides:

- Extremely fast read performance

- Simple extensibility (add a new place = add a JSON file)

- Serverless-friendly deployment


## 🔌 API overview
### 1️⃣ List places
GET `/places`

#### Query parameters
| Name         | Description               |
| ------------ | ------------------------- |
| `region`     | `hong-kong` or `macau`    |
| `categories` | Filter by category IDs    |
| `orderBy`    | `id`, `ranking`, `rating`, etc. |
| `limit`      | Page size (default: 20, max: 50)   |
| `cursor`     | ID of the first item to return on the next page |

### 2️⃣ Get place details
GET `/places/{id}`

Returns full details for a specific place

### 3️⃣ List categories
GET `/categories`

Returns all supported place categories

### 4️⃣ Generate a daily route
POST `/routes/day`

Generates point-to-point routes between selected places.

Request body
```
{
  "date": "2025-11-30",
  "mode": "transit",
  "placeIds": [1, 2, 3]
}
```
### Validation rules
- At least 2 places required
- All places must belong to the same region
- Date cannot be in the past (Asia/Hong_Kong timezone)
- For `driving`, departure time is always guaranteed to be in the future

### Response includes
- per-leg distance & duration
- detailed transit steps (bus/subway/walking)
- transit line short name preferred over full name (e.g. bus route number)
- encoded polyline for map rendering

## Project structure
```
backend/
├── Controllers/
│   ├── PlacesController.cs
│   ├── CategoriesController.cs
│   └── RoutesController.cs
│
├── Services/
|   ├── Interface/
|   |   ├── IPlaceMemory.cs
|   |   └── IRoutingService.cs
│   ├── PlaceRepository.cs
│   └── GoogleRoutingService.cs
│
├── Models/
│   ├── Place.cs
│   ├── RouteDtos.cs
│   └── Category.cs
│
├── Data/
│   └── places/
│       ├── 2136178.json
│       ├── 311604.json
│       └── ...
│
├── Program.cs
├── appsettings.json
└── appsettings.Production.json
```

## 🚀 Deployment
The backend is deployed using Azure App Service with GitHub Actions CI/CD.
