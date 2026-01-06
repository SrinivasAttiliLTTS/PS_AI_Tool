# import os
# import re
# import json
# import logging
# import traceback
# from llama_cpp import Llama

# # ======================================================
# # Logging Setup
# # ======================================================
# logging.basicConfig(
#     filename="skill_extractor.log",
#     level=logging.DEBUG,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

# logging.info("======================================================")
# logging.info("🚀 Starting JD Skill Extractor Backend")
# logging.info("======================================================")

# # ======================================================
# # Load Local GGUF Model
# # ======================================================

# MODEL_PATH = "./model/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

# logging.debug("🔍 Checking model file path...")
# if not os.path.exists(MODEL_PATH):
#     logging.error(f"❌ Model not found at {MODEL_PATH}")
# else:
#     logging.info(f"📁 Model located. Loading from: {MODEL_PATH}")

# try:
#     llm = Llama(
#         model_path=MODEL_PATH,
#         n_ctx=4096,
#         n_threads=8,
#         temperature=0.2,
#         stop=["</s>"]
#     )
#     logging.info("✅ GGUF Model loaded successfully.")

# except Exception as e:
#     logging.error("❌ Fatal: Model loading failed.")
#     logging.error(traceback.format_exc())
#     raise e


# # ======================================================
# # Clean Input
# # ======================================================

# def clean_text(text: str) -> str:
#     logging.debug("🧹 Cleaning JD text...")
#     text = re.sub(r"\s+", " ", text)
#     cleaned = text.strip()
#     logging.debug(f"👉 Cleaned JD snippet (300 chars): {cleaned[:300]}")
#     logging.debug(f"📝 JD total length: {len(cleaned)} chars")
#     return cleaned


# # ======================================================
# # AI Prompt Template
# # ======================================================

# EXTRACTION_PROMPT = """
# You are an AI assistant that extracts skills from a Job Description.
# Return skills in three categories EXACTLY like this:

# {
#  "primary": ["skill1", "skill2"],
#  "secondary": ["skill1", "skill2"],
#  "other": ["skill1", "skill2"]
# }

# Rules:
# - Only technical skills (tools, languages, frameworks)
# - Do not add soft skills
# - No extra text, only JSON
# - Do not invent any skills.

# Job Description:
# """


# # ======================================================
# # Core Extraction Logic
# # ======================================================

# def extract_skills_ai(jd_text: str):
#     logging.info("======================================================")
#     logging.info("📥 extract_skills_ai() invoked")
#     logging.info("======================================================")

#     cleaned = clean_text(jd_text)

#     logging.info("JD text cleaned successfully.")
#     logging.debug(f"📄 Full cleaned JD (first 500 chars): {cleaned[:500]}")

#     prompt = EXTRACTION_PROMPT + cleaned + "\n\nReturn only JSON.\n"

#     logging.info("🔧 Preparing LLM prompt...")
#     logging.debug(f"🧠 Prompt (first 500 chars): {prompt[:500]}")

#     # ------------------------------
#     # LLM Execution Phase
#     # ------------------------------

#     logging.info("⚡ Sending request to LLM...")
#     try:
#         response = llm(
#             prompt,
#             max_tokens=512,
#             echo=False
#         )
#         logging.info("🤖 LLM responded successfully.")

#     except Exception as e:
#         logging.error("❌ LLM execution failed!")
#         logging.error(traceback.format_exc())
#         return {
#             "primarySkills": [],
#             "secondarySkills": [],
#             "otherSkills": []
#         }

#     # Token usage (if available)
#     if "usage" in response:
#         logging.info(f"📊 Token Usage: {response['usage']}")

#     raw_output = response["choices"][0]["text"].strip()

#     logging.info("📨 Raw LLM Output received")
#     logging.debug(f"🧾 Raw output snippet (400 chars): {raw_output[:400]}")
#     logging.info(f"🧾 FULL Raw Output:\n{raw_output}")

#     # ------------------------------
#     # JSON Parsing Phase
#     # ------------------------------

#     try:
#         logging.info("🔍 Attempting to parse JSON output...")

#         cleaned_json = raw_output.replace("\n", "").replace("\t", "").strip()

#         skills = json.loads(cleaned_json)

#         result = {
#             "primarySkills": skills.get("primary", []),
#             "secondarySkills": skills.get("secondary", []),
#             "otherSkills": skills.get("other", [])
#         }

#         logging.info("🎉 JSON parsed successfully.")
#         logging.debug(f"📦 Parsed JSON skills: {result}")

#         return result

#     except Exception:
#         logging.error("❌ JSON parsing failed!")
#         logging.error(traceback.format_exc())
#         logging.error("❗ RAW LLM OUTPUT that caused JSON failure:")
#         logging.error(raw_output)

#         return {
#             "primarySkills": [],
#             "secondarySkills": [],
#             "otherSkills": []
#         }


# # ======================================================
# # Public API Wrappers
# # ======================================================

# def parse_jd(jd_text: str):
#     logging.info("🌐 API call: parse_jd()")
#     return extract_skills_ai(jd_text)


# def extract_skills(jd_text: str):
#     logging.info("🌐 API call: extract_skills()")
#     return extract_skills_ai(jd_text)


# # ======================================================
# # Manual Test (Optional)
# # ======================================================

# if __name__ == "__main__":
#     logging.info("🧪 Running manual test example...")
#     sample_jd = """
#     Strong in Python, FastAPI, AWS, Docker, JavaScript, React.
#     Experience with Postgres, CI/CD, and Terraform.
#     """
#     result = parse_jd(sample_jd)
#     print(result)
#     logging.info("🧪 Manual test completed.")


# import os
# import re
# import json
# import logging
# import traceback
# from llama_cpp import Llama

# # ======================================================
# # Logging Setup
# # ======================================================
# logging.basicConfig(
#     filename="skill_extractor.log",
#     level=logging.DEBUG,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

# logging.info("======================================================")
# logging.info("🚀 Starting JD Skill Extractor Backend")
# logging.info("======================================================")

# # ======================================================
# # Load Local GGUF Model
# # ======================================================
# MODEL_PATH = "./model/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

# logging.debug("🔍 Checking model file path...")
# if not os.path.exists(MODEL_PATH):
#     logging.error(f"❌ Model not found at {MODEL_PATH}")
# else:
#     logging.info(f"📁 Model located. Loading from: {MODEL_PATH}")

# try:
#     llm = Llama(
#         model_path=MODEL_PATH,
#         n_ctx=4096,
#         n_threads=8,
#         temperature=0.2,
#         stop=["</s>"]
#     )
#     logging.info("✅ GGUF Model loaded successfully.")
# except Exception as e:
#     logging.error("❌ Fatal: Model loading failed.")
#     logging.error(traceback.format_exc())
#     raise e

# # ======================================================
# # Clean Input
# # ======================================================
# def clean_text(text: str) -> str:
#     logging.debug("🧹 Cleaning JD text...")
#     text = re.sub(r"\s+", " ", text)
#     cleaned = text.strip()
#     logging.debug(f"👉 Cleaned JD snippet (300 chars): {cleaned[:300]}")
#     logging.debug(f"📝 JD total length: {len(cleaned)} chars")
#     return cleaned

# # ======================================================
# # AI Prompt Template
# # ======================================================
# EXTRACTION_PROMPT = """
# You are an AI assistant that extracts skills from a Job Description.
# Return skills in three categories EXACTLY like this:

# {
#  "primary": ["skill1", "skill2"],
#  "secondary": ["skill1", "skill2"],
#  "other": ["skill1", "skill2"]
# }

# Rules:
# - Only technical skills (tools, languages, frameworks)
# - Do not add soft skills
# - No extra text, only JSON
# - Do not invent any skills
# - Do NOT split combined skills. If the JD lists Angular/React/Vue, keep it as a single skill.

# Job Description:
# """

# # ======================================================
# # Helper: Extract JSON from LLM output safely
# # ======================================================
# def extract_json_from_text(text: str):
#     logging.debug("🔍 Attempting to extract JSON from LLM output...")
#     try:
#         # Extract first JSON object only
#         match = re.search(r"\{.*?\}", text, re.DOTALL)
#         if match:
#             cleaned_json = match.group(0)
#             return json.loads(cleaned_json)
#         else:
#             logging.error("❌ No JSON found in LLM output")
#             return {"primary": [], "secondary": [], "other": []}
#     except Exception:
#         logging.error("❌ JSON extraction failed")
#         logging.error(traceback.format_exc())
#         logging.error(f"LLM output:\n{text}")
#         return {"primary": [], "secondary": [], "other": []}

# # ======================================================
# # Extract Skills Using LLM
# # ======================================================
# def extract_skills_from_llm(jd_text: str):
#     cleaned = clean_text(jd_text)
#     prompt = EXTRACTION_PROMPT + cleaned + "\n\nReturn only JSON.\n"

#     logging.info("⚡ Sending request to LLM...")
#     try:
#         response = llm(prompt, max_tokens=512, echo=False)
#         logging.info("🤖 LLM responded successfully.")
#     except Exception:
#         logging.error("❌ LLM execution failed!")
#         logging.error(traceback.format_exc())
#         return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

#     raw_output = response["choices"][0]["text"].strip()
#     logging.info("📨 Raw LLM Output received")
#     logging.debug(f"🧾 Raw output snippet (400 chars): {raw_output[:400]}")

#     skills_json = extract_json_from_text(raw_output)
#     result = {
#         "primarySkills": skills_json.get("primary", []),
#         "secondarySkills": skills_json.get("secondary", []),
#         "otherSkills": skills_json.get("other", [])
#     }
#     logging.info(f"🎯 Extracted JD Skills: {result}")
#     return result

# # ======================================================
# # Extract Skills From Formatted JD
# # ======================================================
# def extract_skills_from_formatted_jd(jd_text: str):
#     logging.debug("🔍 Checking if JD is already in Primary/Secondary/Other format")
#     try:
#         primary = re.findall(r"Primary Skills:\s*(.*?)(?:Secondary Skills:|$)", jd_text, re.DOTALL)
#         secondary = re.findall(r"Secondary Skills:\s*(.*?)(?:Other Skills:|$)", jd_text, re.DOTALL)
#         other = re.findall(r"Other Skills:\s*(.*)", jd_text, re.DOTALL)

#         def clean_list(skills_list):
#             if not skills_list:
#                 return []
#             return [s.strip() for s in skills_list[0].split(",") if s.strip()]

#         result = {
#             "primarySkills": clean_list(primary),
#             "secondarySkills": clean_list(secondary),
#             "otherSkills": clean_list(other)
#         }
#         logging.debug(f"✅ Extracted from formatted JD: {result}")
#         return result
#     except Exception:
#         logging.error("❌ Failed to extract from formatted JD")
#         logging.error(traceback.format_exc())
#         return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

# # ======================================================
# # Core Extraction Logic
# # ======================================================
# def extract_skills_ai(jd_text: str):
#     # Try formatted JD extraction first
#     result = extract_skills_from_formatted_jd(jd_text)
#     if result["primarySkills"] or result["secondarySkills"] or result["otherSkills"]:
#         logging.info("🌟 JD parsed using formatted JD logic")
#         return result

#     # Otherwise fallback to LLM extraction
#     logging.info("⚡ Falling back to LLM extraction")
#     return extract_skills_from_llm(jd_text)

# # ======================================================
# # Public API Wrappers
# # ======================================================
# def parse_jd(jd_text: str):
#     logging.info("🌐 API call: parse_jd()")
#     return extract_skills_ai(jd_text)

# def extract_skills(jd_text: str):
#     logging.info("🌐 API call: extract_skills()")
#     return extract_skills_ai(jd_text)

# # ======================================================
# # Manual Test
# # ======================================================
# if __name__ == "__main__":
#     logging.info("🧪 Running manual test example...")
#     sample_jd = """
# Primary Skills: HTML, CSS/SCSS, TypeScript, Angular/React/Vue, Accessibility (WCAG 2.1+), i18n/RTL Support, Playwright/Vitest/Sonar (Code Quality)
# Secondary Skills: Lit/Web Components, GitHub Copilot, StackBlitz, axe-core, Lighthouse, Responsive Design, Cross-Browser Compatibility, Unit Testing, E2E Testing, Design System Integration, Secure Coding/Cybersecurity, CI/CD, Git, Agile, Figma
# Other Skills: Debugging, Problem Solving, Real-time Issue Troubleshooting, Prototyping & Demos, Code Reviews, Documentation, Design System Governance, Strong Communication, Attention to Detail, Performance Optimization
# """
#     result = parse_jd(sample_jd)
#     print(result)
#     logging.info("🧪 Manual test completed.")



# import os
# import re
# import json
# import logging
# import traceback
# from datetime import datetime
# from llama_cpp import Llama

# # ======================================================
# # Logging Setup
# # ======================================================
# logging.basicConfig(
#     filename="skill_extractor.log",
#     level=logging.DEBUG,
#     format="%(asctime)s - %(levelname)s - %(message)s"
# )

# logging.info("======================================================")
# logging.info("🚀 Starting JD Skill Extractor Backend")
# logging.info("======================================================")

# # ======================================================
# # Load Local GGUF Model
# # ======================================================
# MODEL_PATH = "./model/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

# logging.debug("🔍 Checking model file path...")
# if not os.path.exists(MODEL_PATH):
#     logging.error(f"❌ Model not found at {MODEL_PATH}")
# else:
#     logging.info(f"📁 Model located. Loading from: {MODEL_PATH}")

# try:
#     llm = Llama(
#         model_path=MODEL_PATH,
#         n_ctx=4096,
#         n_threads=8,
#         temperature=0.2,
#         stop=["</s>"]
#     )
#     logging.info("✅ GGUF Model loaded successfully.")
# except Exception as e:
#     logging.error("❌ Fatal: Model loading failed.")
#     logging.error(traceback.format_exc())
#     raise e

# # ======================================================
# # Clean Input
# # ======================================================
# def clean_text(text: str) -> str:
#     logging.debug("🧹 Cleaning JD text...")
#     text = re.sub(r"\s+", " ", text)
#     cleaned = text.strip()
#     logging.debug(f"👉 Cleaned JD snippet (300 chars): {cleaned[:300]}")
#     logging.debug(f"📝 JD total length: {len(cleaned)} chars")
#     return cleaned

# # ======================================================
# # AI Prompt Template
# # ======================================================
# EXTRACTION_PROMPT = """
# You are an AI assistant that extracts skills from a Job Description.
# Return skills in three categories EXACTLY like this:

# {
#  "primary": ["skill1", "skill2"],
#  "secondary": ["skill1", "skill2"],
#  "other": ["skill1", "skill2"]
# }

# Rules:
# - Only technical skills (tools, languages, frameworks)
# - Do not add soft skills
# - No extra text, only JSON
# - Do not invent any skills
# - Do NOT split combined skills. If the JD lists Angular/React/Vue, keep it as a single skill.

# Job Description:
# """

# # ======================================================
# # Helper: Extract JSON from LLM output safely
# # ======================================================
# def extract_json_from_text(text: str):
#     logging.debug("🔍 Attempting to extract JSON from LLM output...")
#     try:
#         match = re.search(r"\{.*?\}", text, re.DOTALL)
#         if match:
#             cleaned_json = match.group(0)
#             return json.loads(cleaned_json)
#         else:
#             logging.error("❌ No JSON found in LLM output")
#             return {"primary": [], "secondary": [], "other": []}
#     except Exception:
#         logging.error("❌ JSON extraction failed")
#         logging.error(traceback.format_exc())
#         logging.error(f"LLM output:\n{text}")
#         return {"primary": [], "secondary": [], "other": []}

# # ======================================================
# # Extract Skills Using LLM
# # ======================================================
# def extract_skills_from_llm(jd_text: str):
#     cleaned = clean_text(jd_text)
#     prompt = EXTRACTION_PROMPT + cleaned + "\n\nReturn only JSON.\n"

#     logging.info("⚡ Sending request to LLM...")
#     try:
#         response = llm(prompt, max_tokens=512, echo=False)
#         logging.info("🤖 LLM responded successfully.")
#     except Exception:
#         logging.error("❌ LLM execution failed!")
#         logging.error(traceback.format_exc())
#         return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

#     raw_output = response["choices"][0]["text"].strip()
#     logging.info("📨 Raw LLM Output received")
#     logging.debug(f"🧾 Raw output snippet (400 chars): {raw_output[:400]}")

#     skills_json = extract_json_from_text(raw_output)
#     result = {
#         "primarySkills": skills_json.get("primary", []),
#         "secondarySkills": skills_json.get("secondary", []),
#         "otherSkills": skills_json.get("other", [])
#     }
#     logging.info(f"🎯 Extracted JD Skills: {result}")
#     return result

# # ======================================================
# # Extract Skills From Formatted JD
# # ======================================================
# def extract_skills_from_formatted_jd(jd_text: str):
#     logging.debug("🔍 Checking if JD is already in Primary/Secondary/Other format")
#     try:
#         primary = re.findall(r"Primary Skills:\s*(.*?)(?:Secondary Skills:|$)", jd_text, re.DOTALL)
#         secondary = re.findall(r"Secondary Skills:\s*(.*?)(?:Other Skills:|$)", jd_text, re.DOTALL)
#         other = re.findall(r"Other Skills:\s*(.*)", jd_text, re.DOTALL)

#         def clean_list(skills_list):
#             if not skills_list:
#                 return []
#             return [s.strip() for s in skills_list[0].split(",") if s.strip()]

#         result = {
#             "primarySkills": clean_list(primary),
#             "secondarySkills": clean_list(secondary),
#             "otherSkills": clean_list(other)
#         }
#         logging.debug(f"✅ Extracted from formatted JD: {result}")
#         return result
#     except Exception:
#         logging.error("❌ Failed to extract from formatted JD")
#         logging.error(traceback.format_exc())
#         return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

# # ======================================================
# # Core Extraction Logic
# # ======================================================
# def extract_skills_ai(jd_text: str):
#     # Try formatted JD extraction first
#     result = extract_skills_from_formatted_jd(jd_text)
#     if result["primarySkills"] or result["secondarySkills"] or result["otherSkills"]:
#         logging.info("🌟 JD parsed using formatted JD logic")
#         return result

#     # Otherwise fallback to LLM extraction
#     logging.info("⚡ Falling back to LLM extraction")
#     return extract_skills_from_llm(jd_text)

# # ======================================================
# # Extract Metadata: Client, Role, Profiles Received From
# # ======================================================
# def extract_jd_metadata(jd_text: str):
#     metadata = {"client": "", "role": "", "profiles_received_from": ""}
#     try:
#         client_match = re.search(r"Client\s*:\s*(.+)", jd_text, re.IGNORECASE)
#         role_match = re.search(r"Role\s*:\s*(.+)", jd_text, re.IGNORECASE)
#         profiles_match = re.search(r"Profiles Received From\s*:\s*(.+)", jd_text, re.IGNORECASE)

#         if client_match:
#             metadata["client"] = client_match.group(1).strip()
#         if role_match:
#             metadata["role"] = role_match.group(1).strip()
#         if profiles_match:
#             metadata["profiles_received_from"] = profiles_match.group(1).strip()

#     except Exception:
#         logging.error("❌ Metadata extraction failed!")
#         logging.error(traceback.format_exc())

#     logging.info(f"📝 Extracted metadata: {metadata}")
#     return metadata

# # ======================================================
# # Generate CSV Filename
# # ======================================================
# def generate_csv_filename(metadata: dict):
#     client = metadata.get("client", "").replace(" ", "_")
#     role = metadata.get("role", "").replace(" ", "_")

#     if client and role:
#         now = datetime.now().strftime("%Y%m%d_%H%M%S")
#         filename = f"{client}_{role}_{now}.csv"
#     else:
#         filename = "result.csv"

#     logging.info(f"📁 Generated CSV filename: {filename}")
#     return filename

# # ======================================================
# # Public API Wrappers
# # ======================================================
# def parse_jd(jd_text: str):
#     logging.info("🌐 API call: parse_jd()")
#     skills = extract_skills_ai(jd_text)
#     metadata = extract_jd_metadata(jd_text)
#     filename = generate_csv_filename(metadata)
#     return {"skills": skills, "metadata": metadata, "csv_filename": filename}

# def extract_skills(jd_text: str):
#     logging.info("🌐 API call: extract_skills()")
#     return parse_jd(jd_text)

# # ======================================================
# # Manual Test
# # ======================================================
# if __name__ == "__main__":
#     logging.info("🧪 Running manual test example...")
#     sample_jd = """
# Client: ABC Technologies
# Role: Senior Developer
# Profiles Received From: LinkedIn

# Primary Skills: HTML, CSS/SCSS, TypeScript, Angular/React/Vue, Accessibility (WCAG 2.1+), i18n/RTL Support, Playwright/Vitest/Sonar (Code Quality)
# Secondary Skills: Lit/Web Components, GitHub Copilot, StackBlitz, axe-core, Lighthouse, Responsive Design, Cross-Browser Compatibility, Unit Testing, E2E Testing, Design System Integration, Secure Coding/Cybersecurity, CI/CD, Git, Agile, Figma
# Other Skills: Debugging, Problem Solving, Real-time Issue Troubleshooting, Prototyping & Demos, Code Reviews, Documentation, Design System Governance, Strong Communication, Attention to Detail, Performance Optimization
# """
#     result = parse_jd(sample_jd)
#     print(result)
#     logging.info("🧪 Manual test completed.")

# backend/jd_skill_extractor
import os
import re
import json
import logging
import traceback
try:
    from llama_cpp import Llama
    LLAMA_AVAILABLE = True
except ImportError:
    Llama = None
    LLAMA_AVAILABLE = False

# ======================================================
# Logging Setup
# ======================================================
logging.basicConfig(
    filename="skill_extractor.log",
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s"
)

logging.info("======================================================")
logging.info("🚀 Starting JD Skill Extractor Backend")
logging.info("======================================================")

# ======================================================
# Load Local GGUF Model
# ======================================================
# MODEL_PATH = "./model/mistral-7b-instruct-v0.2.Q4_K_M.gguf"

logging.debug("🔍 Checking model file path...")
# if not os.path.exists(MODEL_PATH):
#     logging.error(f"❌ Model not found at {MODEL_PATH}")
# else:
#     logging.info(f"📁 Model located. Loading from: {MODEL_PATH}")

# try:
#     llm = Llama(
#         model_path=MODEL_PATH,
#         n_ctx=4096,
#         n_threads=8,
#         temperature=0.2,
#         stop=["</s>"]
#     )
#     logging.info("✅ GGUF Model loaded successfully.")
# except Exception as e:
#     logging.error("❌ Fatal: Model loading failed.")
#     logging.error(traceback.format_exc())
#     raise e

# ======================================================
# Clean Input
# ======================================================
def clean_text(text: str) -> str:
    logging.debug("🧹 Cleaning JD text...")
    text = re.sub(r"\s+", " ", text)
    cleaned = text.strip()
    logging.debug(f"👉 Cleaned JD snippet (300 chars): {cleaned[:300]}")
    logging.debug(f"📝 JD total length: {len(cleaned)} chars")
    return cleaned

# ======================================================
# NEW FEATURE — Extract Client / Role / Profiles
# ======================================================
def extract_metadata(jd_text: str):
    logging.debug("🔍 Extracting Client, Role, Profiles Received From...")

    client = re.search(r"Client:\s*(.*)", jd_text)
    role = re.search(r"Role:\s*(.*)", jd_text)
    profiles = re.search(r"Profiles\s*Received\s*From:\s*(.*)", jd_text)

    metadata = {
        "client": client.group(1).strip() if client else "",
        "role": role.group(1).strip() if role else "",
        "profilesReceivedFrom": profiles.group(1).strip() if profiles else ""
    }

    logging.info(f"📌 Parsed Metadata: {metadata}")
    return metadata

# ======================================================
# AI Prompt Template
# ======================================================
EXTRACTION_PROMPT = """
You are an AI assistant that extracts skills from a Job Description.
Return skills in three categories EXACTLY like this:

{
 "primary": ["skill1", "skill2"],
 "secondary": ["skill1", "skill2"],
 "other": ["skill1", "skill2"]
}

Rules:
- Only technical skills (tools, languages, frameworks)
- Do not add soft skills
- No extra text, only JSON
- Do not invent any skills
- Do NOT split combined skills. If the JD lists Angular/React/Vue, keep it as a single skill.

Job Description:
"""

# ======================================================
# Helper: Extract JSON from LLM output safely
# ======================================================
def extract_json_from_text(text: str):
    logging.debug("🔍 Attempting to extract JSON from LLM output...")
    try:
        match = re.search(r"\{.*?\}", text, re.DOTALL)
        if match:
            cleaned_json = match.group(0)
            return json.loads(cleaned_json)
        else:
            logging.error("❌ No JSON found in LLM output")
            return {"primary": [], "secondary": [], "other": []}
    except Exception:
        logging.error("❌ JSON extraction failed")
        logging.error(traceback.format_exc())
        logging.error(f"LLM output:\n{text}")
        return {"primary": [], "secondary": [], "other": []}

# ======================================================
# Extract Skills Using LLM
# ======================================================
def extract_skills_from_llm(jd_text: str):
    # if not LLAMA_AVAILABLE:
    #     logging.warning("⚠️ LLM not available. Skipping LLM extraction.")
    #     return {
    #         "primarySkills": [],
    #         "secondarySkills": [],
    #         "otherSkills": []
    #     }
    cleaned = clean_text(jd_text)
    prompt = EXTRACTION_PROMPT + cleaned + "\n\nReturn only JSON.\n"

    logging.info("⚡ Sending request to LLM...")
    try:
        response = llm(prompt, max_tokens=512, echo=False)
        logging.info("🤖 LLM responded successfully.")
    except Exception:
        logging.error("❌ LLM execution failed!")
        logging.error(traceback.format_exc())
        return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

    raw_output = response["choices"][0]["text"].strip()
    logging.info("📨 Raw LLM Output received")
    logging.debug(f"🧾 Raw output snippet (400 chars): {raw_output[:400]}")

    skills_json = extract_json_from_text(raw_output)
    result = {
        "primarySkills": skills_json.get("primary", []),
        "secondarySkills": skills_json.get("secondary", []),
        "otherSkills": skills_json.get("other", [])
    }
    logging.info(f"🎯 Extracted JD Skills: {result}")
    return result

# ======================================================
# Extract Skills From Formatted JD
# ======================================================
def extract_skills_from_formatted_jd(jd_text: str):
    logging.debug("🔍 Checking if JD is already in Primary/Secondary/Other format")
    try:
        primary = re.findall(r"Primary Skills:\s*(.*?)(?:Secondary Skills:|$)", jd_text, re.DOTALL)
        secondary = re.findall(r"Secondary Skills:\s*(.*?)(?:Other Skills:|$)", jd_text, re.DOTALL)
        other = re.findall(r"Other Skills:\s*(.*)", jd_text, re.DOTALL)

        def clean_list(skills_list):
            if not skills_list:
                return []
            return [s.strip() for s in skills_list[0].split(",") if s.strip()]

        result = {
            "primarySkills": clean_list(primary),
            "secondarySkills": clean_list(secondary),
            "otherSkills": clean_list(other)
        }
        logging.debug(f"✅ Extracted from formatted JD: {result}")
        return result
    except Exception:
        logging.error("❌ Failed to extract from formatted JD")
        logging.error(traceback.format_exc())
        return {"primarySkills": [], "secondarySkills": [], "otherSkills": []}

# ======================================================
# Core Extraction Logic
# ======================================================
def extract_skills_ai(jd_text: str):
    # Try formatted JD extraction first
    result = extract_skills_from_formatted_jd(jd_text)
    if result["primarySkills"] or result["secondarySkills"] or result["otherSkills"]:
        logging.info("🌟 JD parsed using formatted JD logic")
        return result

    # Otherwise fallback to LLM extraction
    logging.info("⚡ Falling back to LLM extraction")
    return extract_skills_from_llm(jd_text)

# ======================================================
# Public API Wrappers
# ======================================================
def parse_jd(jd_text: str):
    logging.info("🌐 API call: parse_jd()")

    # NEW: extract metadata
    metadata = extract_metadata(jd_text)

    # Extract skills
    skills = extract_skills_ai(jd_text)

    # Merge and return final result
    return {**metadata, **skills}

def extract_skills(jd_text: str):
    logging.info("🌐 API call: extract_skills()")
    metadata = extract_metadata(jd_text)
    skills = extract_skills_ai(jd_text)
    return {**metadata, **skills}

# ======================================================
# Manual Test
# ======================================================
if __name__ == "__main__":
    logging.info("🧪 Running manual test example...")
    sample_jd = """
Client: Abscienx
Role: C++ Dev
Profiles Received From: Nikitha

Primary Skills: HTML, CSS/SCSS, TypeScript, Angular/React/Vue, Accessibility
Secondary Skills: Lit/Web Components, GitHub Copilot, StackBlitz
Other Skills: Debugging, Documentation
"""
    result = parse_jd(sample_jd)
    print(result)
    logging.info("🧪 Manual test completed.")
