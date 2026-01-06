# # screening_logger.py
# import json
# import os
# from datetime import datetime
# import logging

# LOG_FILE = "screening_logs.json"
# logger = logging.getLogger(__name__)

# def save_screening_log(
#     client: str,
#     role: str,
#     key_skills,
#     selected_profiles,
# ):
#     try:
#         log_entry = {
#             "GeneratedOn": datetime.utcnow().isoformat(),
#             "Client": client,
#             "Role": role,
#             "KeySkill": key_skills,
#             "Selected Profiles": selected_profiles,
#             "Count": len(selected_profiles),
#             "Selected": True if selected_profiles else False
#         }

#         logs = []
#         if os.path.exists(LOG_FILE):
#             with open(LOG_FILE, "r", encoding="utf-8") as f:
#                 logs = json.load(f)

#         logs.append(log_entry)

#         with open(LOG_FILE, "w", encoding="utf-8") as f:
#             json.dump(logs, f, indent=2)

#         logger.info("📊 Screening log saved successfully")

#     except Exception as e:
#         logger.error("❌ Failed to save screening log")
#         logger.exception(e)

# screening_logger.py
import json
import os
from datetime import datetime
import logging

LOG_FILE = "screening_logs.json"
logger = logging.getLogger(__name__)

def save_screening_log(
    client: str,
    role: str,
    key_skills,
    total_profiles: int,
    selected_profiles: list,
    rejected_profiles: list
):
    try:
        log_entry = {
            "GeneratedOn": datetime.utcnow().isoformat(),
            "Client": client,
            "Role": role,
            "KeySkill": key_skills,

            "TotalProfiles": total_profiles,

            "Selected Profiles": selected_profiles,
            "Rejected Profiles": rejected_profiles,

            "Count": len(selected_profiles),
            "RejectedCount": len(rejected_profiles),
            "Selected": True if selected_profiles else False
        }

        logs = []
        if os.path.exists(LOG_FILE):
            with open(LOG_FILE, "r", encoding="utf-8") as f:
                logs = json.load(f)

        logs.append(log_entry)

        with open(LOG_FILE, "w", encoding="utf-8") as f:
            json.dump(logs, f, indent=2)

        logger.info("📊 Screening log saved successfully")

    except Exception as e:
        logger.error("❌ Failed to save screening log")
        logger.exception(e)
