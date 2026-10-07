from typing import List, Dict
import logging

logger = logging.getLogger(__name__)

async def match_resume_to_jobs(resume_text: str, jobs: List[Dict]) -> List[Dict]:
    """
    Mock implementation of resume matching.
    In reality, we would use spacy or sentence-transformers here.
    """
    logger.info("Matching resume against jobs...")
    # Add a mock match score to each job
    import random
    scored_jobs = []
    for job in jobs:
        # Mock logic: generate a random match score between 50 and 99
        score = random.randint(50, 99)
        scored_job = {**job, "match": score}
        scored_jobs.append(scored_job)
        
    # Sort by match score descending
    scored_jobs.sort(key=lambda x: x["match"], reverse=True)
    return scored_jobs
