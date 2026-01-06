# Explore Hong Kong & Macau

This is the frontend application for Explore Hong Kong & Macau.

## 🛠 Project setup

### Installation

This project uses [pnpm](https://pnpm.io/) as the package manager.

1.  Clone the repository.

2.  Navigate to this directory: `cd frontend`

3.  Install dependencies: `pnpm install`

### Environment Settings

Set the following environment variable:

- `NEXT_PUBLIC_API_URL` – Base URL of the backend API

If this value changes, also update the `input` field in `openapi-ts.config.ts` so the API client can be regenerated from the OpenAPI specification.

### Commands

| Command        | Description                                                      |
| :------------- | :--------------------------------------------------------------- |
| `pnpm dev`     | Starts the development server at `http://localhost:3000`.        |
| `pnpm build`   | Builds the application for production.                           |
| `pnpm start`   | Starts the production server.                                    |
| `pnpm lint`    | Runs ESLint to check for code quality issues.                    |
| `pnpm format`  | Formats the code using Prettier.                                 |
| `pnpm codegen` | Generates the API client from the backend OpenAPI specification. |

## 🧩 Packages & tools

This project relies on several libraries and tools to support its functionality:

- **Persisted storage**: Itinerary data is stored in localStorage and managed via [**Zustand**](https://zustand-demo.pmnd.rs/).

- **Managing itinerary**: Arranging items is done using a drag-and-drop interface powered by [**@dnd-kit**](https://dndkit.com/).

- **Geodata visualization**: Maps showing locations and routes use [**React Leaflet**](https://react-leaflet.js.org/) to display OpenStreetMap data.

- **Type-safe API**: Backend integration with the auto-generated client SDK using [**Hey API**](https://heyapi.dev/).

## 🧱 Directory structure

The project is built with **Next.js (App Router)** and follows its file system conventions. The codebase is organized by topic and responsibility:

### 1. Application & routing

The `app/` directory defines all application routes and pages, organized in the following hierarchy:

- `[region]/` - Application entry (region-specific)
    - `(with-header)/` – Pages with the header and floating action button
        - `(home)/` – **Application home page**
    - `(no-header)/` – Pages without a header (mostly subpages)
        - `location/[id]/` – **Location details page** (ID-specific)
        - `itinerary/(list)/` – **Itinerary list page**
        - `itinerary/route/[day]/` – **Itinerary route page** (day-specific)
    - `@modal/` – Intercepting routes displayed using a modal layout
        - `(.)locations/[id]/` - Location details pop-up
        - `(.)itinerary/route/[day]/` - Itinerary route pop-up
    - `@sheet/` – Intercepting routes displayed using a sheet layout
        - `(.)itinerary/(list)/` - Itinerary list pop-up

#### Intercepting routes conventions

Pages that support [intercepting routes](https://nextjs.org/docs/app/api-reference/file-conventions/intercepting-routes) export an index file in their directory, including:

- A **Header** – used by the layout container to provide navigation controls
- A **Content** – the main component that contains the UI and page logic
- An optional **React Suspense fallback** – used for loading states

This unified interface allows both the _original page_ and the _intercepting route_ to **compose page layouts in the same way**, ensuring consistency across the application.

### 2. Components

The `components/` directory contains UI components, following atomic design principles:

- `atoms/` - Domain-specific elements
- `custom/` - Domain-specific components (built from multiple atoms)
- `layout/` - Layout containers (e.g., modal and sheet layout for intercepting pages)
- `ui/` - Generic elements (mostly from shadcn/ui)

### 3. Data & logic

The `services/` directory defines the **core domain logic**, and acts as the **single entry point for all data access**.

It also provides type adapters that normalize raw data (e.g., strings) into domain-ready formats.

### 4. Storage & external data

The `store/` directory provides **Zustand**-based state management, which also acts as an interface for local itinerary storage.

The `integrations/` directory contains integrations with external services, including the auto-generated API clients created using **Hey API**.

**Note that** these layers are never accessed directly by the components. Instead, the data is aggregated and exposed through the **service layer**, so that components can consume data in a simpler way.

### 5. Utilities & types

The `lib/` directory contains shared application utilities:

- `utils.ts` – Reusable helper functions
- `config.ts` – Site configuration (e.g., default values for data types)
- `const.ts` – Shared constants
- `context.tsx` – React context providers (for `[region]` value)

The `types/` directory defines all shared domain models and data structures.
