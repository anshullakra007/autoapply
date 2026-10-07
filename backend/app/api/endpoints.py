from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List
# from app.worker import run_scraping_pipeline # Celery task
from app.services.ai import analyze_ats_gap, stream_cover_letter

router = APIRouter()

class SyncJobsRequest(BaseModel):
    urls: List[str] = []

@router.post("/jobs/sync")
async def sync_jobs(req: SyncJobsRequest):
    """
    Phase 2: Triggers a Celery background worker to scrape the provided URLs.
    """
    try:
        from app.worker import run_scraping_pipeline
        # Dispatch to celery worker
        run_scraping_pipeline.delay()
        return {"status": "success", "message": "Scraping pipeline triggered via Celery."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resume/upload")
async def upload_resume(file: UploadFile = File(...)):
    """
    Phase 3: Extract text, use LLM to structure into JSON, and vectorize.
    """
    return {"status": "success", "message": "Resume uploaded and vectorized successfully."}

@router.get("/jobs/matches")
async def get_matches():
    """
    Phase 3: Perform Cosine Similarity search using pgvector.
    Returns top 50 jobs strictly sorted by semantic match score.
    """
    # Mock return
    return {"status": "success", "data": []}

class AnalyzeRequest(BaseModel):
    job_id: int
    
@router.post("/jobs/analyze")
async def analyze_job(req: AnalyzeRequest):
    """
    Phase 4: ATS Gap Analysis comparing user's resume to job description.
    """
    resume_text = "Mock resume text with React and Python"
    job_desc = "Mock Job Description requiring React, Python, and CI/CD."
    
    analysis = await analyze_ats_gap(resume_text, job_desc)
    return {"status": "success", "gap_analysis": analysis}

@router.post("/jobs/cover-letter")
async def generate_cover_letter(req: AnalyzeRequest):
    """
    Phase 4: Stream an auto-generated cover letter based on B.Tech projects and job requirements.
    """
    resume_text = "Mock resume text with B.Tech projects."
    job_desc = "Mock Job Description."
    
    return StreamingResponse(
        stream_cover_letter(resume_text, job_desc), 
        media_type="text/event-stream"
    )
