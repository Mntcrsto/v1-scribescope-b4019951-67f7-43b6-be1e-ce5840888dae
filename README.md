# ScribeScope

An intelligent web application that automatically performs reverse image searches on your photo library to find origins, authors, and usage rights.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mntcrsto/ScripScope-generated-app-20250925-155610)

ScribeScope is a visually engaging, illustrative-styled web application designed to automate the process of finding the origins of images. Users can drag and drop a batch of photos into the application. For each image, ScribeScope uploads it to a secure Cloudflare Worker backend, which then performs a reverse image search using the SerpApi service to query Google Lens. The backend parses the search results to extract key information like the most likely source URL, author, and license information when available. This structured data is then sent back to the frontend and displayed in a clean, interactive, and beautifully styled table. Users can review the findings, add personal notes, and export the entire dataset as a CSV file for their records.

## Key Features

- **Batch Image Processing**: Upload multiple images at once via a user-friendly drag-and-drop interface.
- **Automated Reverse Image Search**: Leverages the power of Google Lens via SerpApi to find image sources across the web.
- **Structured Data Extraction**: Intelligently parses search results to identify source URLs, authors, and license information.
- **Interactive Results Table**: View, sort, and filter results in a clean and responsive table.
- **In-place Editing**: Add personal notes directly to the results for better record-keeping.
- **CSV Export**: Download all collected data in a single CSV file with one click.
- **Serverless Architecture**: Built on Cloudflare Workers for a scalable, secure, and performant backend.
- **Visually Polished UI**: A beautiful, illustrative design with smooth animations and micro-interactions.

## Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Cloudflare Workers, Hono
- **Animations**: Framer Motion
- **File Uploads**: React Dropzone
- **CSV Parsing**: Papaparse
- **Icons**: Lucide React
- **Language**: TypeScript

## Getting Started

Follow these instructions to get a local copy up and running for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [Bun](https://bun.sh/) package manager

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/scribescope.git
    cd scribescope
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Configure Environment Variables:**
    Create a `.dev.vars` file in the root of the project. This file is used by Wrangler for local development. You will need an API key from [SerpApi](https://serpapi.com/).

    ```ini
    # .dev.vars
    SERPAPI_KEY="your_serpapi_api_key_here"
    ```

### Running in Development Mode

To start the local development server, which runs both the Vite frontend and the Cloudflare Worker backend concurrently:

```bash
bun run dev
```

The application will be available at `http://localhost:3000`.

## Usage

1.  **Open the application** in your web browser.
2.  **Drag and drop** your image files onto the designated upload area, or click to select files from your computer.
3.  **Wait for processing**. A progress indicator will show the status of each image as it's being uploaded and analyzed.
4.  **Review the results** in the table that appears. You can click on links to verify sources.
5.  **Add notes** to any row by clicking on the notes cell.
6.  **Export your data** by clicking the "Export to CSV" button.

## Deployment

This project is designed for easy deployment to Cloudflare Pages.

1.  **Login to Wrangler:**
    ```bash
    bunx wrangler login
    ```

2.  **Set the SerpApi Secret:**
    Before deploying, you must set your SerpApi key as a secret in your Cloudflare account. This ensures your key is not exposed in your code.

    ```bash
    bunx wrangler secret put SERPAPI_KEY
    ```
    You will be prompted to enter your API key.

3.  **Deploy the application:**
    The `deploy` script in `package.json` handles building the frontend and deploying both the static assets and the worker.

    ```bash
    bun run deploy
    ```

Alternatively, you can fork this repository and connect it to a new Cloudflare Pages project for continuous deployment.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Mntcrsto/ScripScope-generated-app-20250925-155610)

## Project Structure

-   `src/`: Contains all the frontend React application code.
    -   `components/`: Reusable React components.
    -   `pages/`: Main page components for the application.
    -   `lib/`: Utility functions and libraries.
    -   `types/`: TypeScript type definitions.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `userRoutes.ts`: Defines the API endpoints for the application.
-   `public/`: Static assets that are served directly.
-   `wrangler.jsonc`: Configuration file for the Cloudflare Worker.

## License

This project is licensed under the MIT License - see the LICENSE file for details.