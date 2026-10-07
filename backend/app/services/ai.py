import os
import logging
import json
from openai import AsyncOpenAI
# import pdfplumber  # used for extracting text from PDFs

logger = logging.getLogger(__name__)

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

async def parse_resume_with_ai(pdf_path: str) -> dict:
    """
    Extracts text via pdfplumber and uses OpenAI to structure it into JSON.
    """
    logger.info("Parsing resume with AI...")
    # Mock extracting text
    # with pdfplumber.open(pdf_path) as pdf:
    #     text = "".join(page.extract_text() for page in pdf.pages)
    text = "Extracted text from B.Tech resume..."

    # Use LLM to structure
    response = await client.chat.completions.create(
        model="gpt-4o",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a resume parser. Extract: skills (list), projects (list), education, years_of_experience. Return JSON."},
            {"role": "user", "content": text}
        ]
    )
    
    return json.loads(response.choices[0].message.content)

async def get_embedding(text: str) -> list[float]:
    """Get vector embedding using text-embedding-3-small."""
    response = await client.embeddings.create(
        input=text,
        model="text-embedding-3-small"
    )
    return response.data[0].embedding

import asyncio

async def analyze_ats_gap(resume_text: str, job_description: str, retries=3) -> str:
    """
    Phase 4: ATS Gap Analysis using LLM with retry guardrails.
    """
    for attempt in range(retries):
        try:
            response = await client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an expert recruiter. Compare the resume to the job description and output a bulleted list of missing keywords/skills."},
                    {"role": "user", "content": f"Resume: {resume_text}\n\nJob: {job_description}"}
                ]
            )
            return response.choices[0].message.content
        except Exception as e:
            logger.error(f"Error calling OpenAI API (Attempt {attempt+1}/{retries}): {e}")
            if attempt == retries - 1:
                return "Analysis unavailable at this time due to high traffic. Please try again."
            await asyncio.sleep(2 ** attempt)  # Exponential backoff

async def stream_cover_letter(resume_text: str, job_description: str):
    """
    Phase 4: Generate a personalized cover letter mapping projects to requirements (Streaming).
    """
    response = await client.chat.completions.create(
        model="gpt-4o",
        stream=True,
        messages=[
            {"role": "system", "content": "You are an expert career coach. Write a highly personalized, concise 3-paragraph cover letter. Map the user's B.Tech projects directly to the core requirements of the job."},
            {"role": "user", "content": f"Resume: {resume_text}\n\nJob: {job_description}"}
        ]
    )
    
    async for chunk in response:
        if chunk.choices[0].delta.content is not None:
            yield chunk.choices[0].delta.content
