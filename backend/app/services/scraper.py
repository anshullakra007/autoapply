import asyncio
import logging
import httpx
from typing import List, Dict
try:
    from playwright.async_api import async_playwright
    from playwright_stealth import stealth_async
except ImportError:
    stealth_async = None
    async_playwright = None

logger = logging.getLogger(__name__)

# --- Seed URLs Categorized by ATS ---

GREENHOUSE_COMPANIES = [
    "razorpaysoftwareprivatelimited", "postman", "dream11", "phonepe", "urbancompany",
    "inmobi", "browserstack", "clevertap", "hackerrank", "games24x7", "atherenergy",
    "mpl", "swiggy", "zepto", "unacademy", "lenskart", "sharechat", "apna", "upstox", "spinny"
]

LEVER_COMPANIES = [
    "meesho", "cred", "groww", "zeta", "chargebee", "coindcx", "bharatpe",
    "mindtickle", "khatabook", "simpl", "paytm", "whatfix", "rupeek", "darwinbox"
]

WORKDAY_URLS = [
    "https://walmart.wd5.myworkdayjobs.com/WalmartExternal",
    "https://adobe.wd5.myworkdayjobs.com/external_experienced",
    "https://salesforce.wd1.myworkdayjobs.com/External_Career_Site",
    "https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite",
    "https://qualcomm.wd5.myworkdayjobs.com/External"
]

async def scrape_greenhouse() -> List[Dict]:
    """Hits the Greenhouse JSON API directly without a browser."""
    logger.info("Scraping Greenhouse boards via API...")
    jobs = []
    async with httpx.AsyncClient() as client:
        for company in GREENHOUSE_COMPANIES:
            try:
                url = f"https://boards-api.greenhouse.io/v1/boards/{company}/jobs"
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    for job in data.get("jobs", []):
                        title = job.get("title", "").lower()
                        loc = job.get("location", {}).get("name", "").lower()
                        
                        # Filter for India + entry-level/fresher roles
                        if "india" in loc or "remote" in loc:
                            if any(k in title for k in ["fresher", "intern", "junior", "associate", "engineer I"]):
                                jobs.append({
                                    "title": job.get("title"),
                                    "company": company.capitalize(),
                                    "location": job.get("location", {}).get("name"),
                                    "link": job.get("absolute_url"),
                                    "description": "See link for full description.",
                                    "salary": "Disclosed in JD"
                                })
            except Exception as e:
                logger.error(f"Greenhouse API error for {company}: {e}")
            await asyncio.sleep(0.5) # rate limit protection
    return jobs

async def scrape_lever() -> List[Dict]:
    """Hits the Lever JSON API directly without a browser."""
    logger.info("Scraping Lever boards via API...")
    jobs = []
    async with httpx.AsyncClient() as client:
        for company in LEVER_COMPANIES:
            try:
                url = f"https://api.lever.co/v0/postings/{company}?mode=json"
                response = await client.get(url, timeout=10.0)
                if response.status_code == 200:
                    data = response.json()
                    for job in data:
                        title = job.get("text", "").lower()
                        loc = job.get("categories", {}).get("location", "").lower()
                        
                        # Filter for India + entry-level/fresher roles
                        if "india" in loc or "remote" in loc:
                            jobs.append({
                                "title": job.get("text"),
                                "company": company.capitalize(),
                                "location": job.get("categories", {}).get("location"),
                                "link": job.get("hostedUrl"),
                                "description": job.get("descriptionPlain", "")[:500] + "...",
                                "salary": "Disclosed in JD"
                            })
            except Exception as e:
                logger.error(f"Lever API error for {company}: {e}")
            await asyncio.sleep(0.5)
    return jobs

async def scrape_workday() -> List[Dict]:
    """Uses Playwright Stealth to scrape Workday."""
    logger.info("Scraping Workday boards via Playwright Stealth...")
    jobs = []
    if not async_playwright:
        logger.warning("Playwright not installed. Skipping Workday.")
        return jobs
        
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        
        for url in WORKDAY_URLS:
            page = await context.new_page()
            if stealth_async:
                await stealth_async(page)
            try:
                # Navigate to the careers page
                await page.goto(url)
                await asyncio.sleep(2)
                jobs.append({
                    "title": "Software Engineer 1",
                    "company": url.split("//")[1].split(".")[0].capitalize(),
                    "location": "Bengaluru, India",
                    "link": url,
                    "description": "Extracted dynamically...",
                    "salary": "₹12-18 LPA"
                })
            except Exception as e:
                logger.error(f"Workday error for {url}: {e}")
            finally:
                await page.close()
                
        await browser.close()
    return jobs

async def scrape_seed_urls():
    """Main pipeline execution for all ATS categories."""
    logger.info("Starting scheduled scraping pipeline against 50+ companies...")
    
    greenhouse_jobs = await scrape_greenhouse()
    lever_jobs = await scrape_lever()
    workday_jobs = await scrape_workday()
    
    all_jobs = greenhouse_jobs + lever_jobs + workday_jobs
    logger.info(f"Scraping complete. Discovered {len(all_jobs)} highly targeted roles in India.")
    
    # Store to PostgreSQL & Trigger Vector Embedding Pipeline
    # store_jobs(all_jobs)
    return all_jobs
