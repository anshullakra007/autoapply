import os
from celery import Celery
from celery.schedules import crontab

redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")

celery_app = Celery(
    "worker",
    broker=redis_url,
    backend=redis_url
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
)

# Schedule scraping every 6 hours
celery_app.conf.beat_schedule = {
    'scrape-jobs-every-6-hours': {
        'task': 'app.worker.run_scraping_pipeline',
        'schedule': crontab(hour='*/6', minute=0),
    },
}

@celery_app.task
def run_scraping_pipeline():
    """
    Background task to run the stealth scraper and AI match engine.
    """
    import asyncio
    from app.services.scraper import scrape_seed_urls
    # Execute the async scraper in the synchronous Celery task
    asyncio.run(scrape_seed_urls())
    return "Scraping pipeline finished"
