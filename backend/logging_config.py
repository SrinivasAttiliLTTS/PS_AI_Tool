import logging
from logging.handlers import RotatingFileHandler

LOG_FILE = "backend.log"

def setup_logging():
    logger = logging.getLogger()
    logger.setLevel(logging.DEBUG)

    # Avoid adding duplicate handlers
    if logger.handlers:
        return

    handler = RotatingFileHandler(
        LOG_FILE, maxBytes=5_000_000, backupCount=5
    )
    formatter = logging.Formatter(
        "%(asctime)s - %(levelname)s - %(name)s - %(message)s"
    )
    handler.setFormatter(formatter)

    logger.addHandler(handler)
