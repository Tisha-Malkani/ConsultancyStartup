# Frontend

React + Vite frontend for the NovaConsult commercial website.

## Local development

1. Copy `.env.example` to `.env`
2. Set `VITE_API_URL`
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the dev server:
   ```bash
   npm run dev
   ```

## Production build

```bash
npm run build
```

The frontend expects the backend API base URL in `VITE_API_URL`, for example:

```env
VITE_API_URL=https://your-backend-domain.com/api
```
