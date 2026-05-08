# FLOW

FLOW is an AI-assisted learning platform with:

- a `backend` FastAPI API for ingestion, test generation, and spaced revision
- a `streamlit_app` UI that is the most deployment-ready part of the project today
- a `frontend` Next.js app that is partially wired and still contains starter/demo content

## Recommended hosting split

The cleanest deployment path for the current codebase is:

1. Deploy `backend` as a Python web service.
2. Deploy `streamlit_app` as a separate Python web service.
3. Point `API_BASE_URL` in the Streamlit service to the backend URL plus `/api/v1`.

This repository includes a root `render.yaml` to simplify that setup on Render.

## Required environment variables

### Backend

- `OPENAI_API_KEY`
- `SECRET_KEY`
- `DATABASE_URL`

### Streamlit

- `API_BASE_URL`
  Example: `https://flow-backend.onrender.com/api/v1`

### Frontend

- `NEXT_PUBLIC_API_BASE_URL`
  Example: `https://flow-backend.onrender.com/api/v1`

## Local run

Backend:

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Streamlit:

```bash
cd streamlit_app
pip install -r requirements.txt
streamlit run app.py
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

## Current caveats

- The Next.js homepage is still starter content.
- Login and signup forms in the Next.js app are not wired to the backend yet.
- The Streamlit app is the most complete UI path right now.
