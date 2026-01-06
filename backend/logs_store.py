import json
import os
from datetime import datetime

LOG_FILE = "screening_logs.json"


def load_logs():
    if not os.path.exists(LOG_FILE):
        return []
    try:
        with open(LOG_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []


def save_log(entry: dict):
    logs = load_logs()
    logs.insert(0, entry)  # newest on top
    with open(LOG_FILE, "w") as f:
        json.dump(logs, f, indent=2)
