# Grok AI Companion

A responsive React and Vite chat app powered by the Gemini API. It supports multi-turn text conversations, image understanding, and image generation.

## Run locally

1. Install Node.js 20.19+ or 22.12+.
2. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
3. Create a `.env.local` file in the project root:

   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. Install dependencies and start the app:

   ```sh
   npm install
   npm run dev
   ```

The app uses `gemini-3.8-flash` for chat and image understanding, and `gemini-2.5-flash-image` for image generation. Image uploads are limited to 10 MB.

## Production key security

Vite exposes variables prefixed with `VITE_` to the browser bundle. For a public deployment, put Gemini requests behind a server-side endpoint and keep the API key on the server. Restrict any development key in Google AI Studio. Do not commit `.env.local`.

## Scripts

- `npm run dev` — start the development server
- `npm run build` — create a production build in `dist/`
- `npm run preview` — serve the production build locally
- `npm run lint` — run Oxlint
