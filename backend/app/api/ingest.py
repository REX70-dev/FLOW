from fastapi import APIRouter, File, UploadFile, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

from app.services.youtube import process_youtube_video
from app.services.pdf import process_pdf
from app.services.ocr import process_image_ocr
from app.services.llm import generate_study_material

router = APIRouter()

# In-memory store for demo purposes (to fetch background task results)
# In production, this should be a proper database table for 'Documents' or 'Summaries'
PROCESSING_RESULTS: Dict[str, Any] = {}

class YouTubeRequest(BaseModel):
    url: str
    task_id: str

def background_youtube_task(url: str, task_id: str):
    PROCESSING_RESULTS[task_id] = {"status": "processing_audio"}
    text = process_youtube_video(url)
    PROCESSING_RESULTS[task_id] = {"status": "generating_study_material", "text": text}
    study_material = generate_study_material(text)
    PROCESSING_RESULTS[task_id] = {"status": "completed", "text": text, "study_material": study_material}

def background_pdf_task(file_bytes: bytes, task_id: str):
    PROCESSING_RESULTS[task_id] = {"status": "processing_pdf"}
    text = process_pdf(file_bytes)
    PROCESSING_RESULTS[task_id] = {"status": "generating_study_material", "text": text}
    study_material = generate_study_material(text)
    PROCESSING_RESULTS[task_id] = {"status": "completed", "text": text, "study_material": study_material}

def background_ocr_task(file_bytes: bytes, task_id: str):
    PROCESSING_RESULTS[task_id] = {"status": "processing_image"}
    text = process_image_ocr(file_bytes)
    PROCESSING_RESULTS[task_id] = {"status": "generating_study_material", "text": text}
    study_material = generate_study_material(text)
    PROCESSING_RESULTS[task_id] = {"status": "completed", "text": text, "study_material": study_material}

@router.post("/youtube")
async def ingest_youtube(request: YouTubeRequest, background_tasks: BackgroundTasks):
    """
    Ingest a YouTube video. It will download the audio and transcribe it in the background.
    """
    background_tasks.add_task(background_youtube_task, request.url, request.task_id)
    return {"message": "YouTube processing started", "task_id": request.task_id}

@router.post("/pdf")
async def ingest_pdf(
    task_id: str, 
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Ingest a PDF file and extract text in the background.
    """
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="File must be a PDF")
    
    file_bytes = await file.read()
    background_tasks.add_task(background_pdf_task, file_bytes, task_id)
    return {"message": "PDF processing started", "task_id": task_id}

@router.post("/image")
async def ingest_image(
    task_id: str,
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...)
):
    """
    Ingest an image file (PNG/JPG) and extract text via OCR in the background.
    """
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    file_bytes = await file.read()
    background_tasks.add_task(background_ocr_task, file_bytes, task_id)
    return {"message": "Image processing started", "task_id": task_id}

@router.get("/status/{task_id}")
async def get_task_status(task_id: str):
    """
    Check the status of a background ingestion task.
    """
    if task_id not in PROCESSING_RESULTS:
        raise HTTPException(status_code=404, detail="Task not found")
    
    return PROCESSING_RESULTS[task_id]
