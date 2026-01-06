
# backend/app.py
import os
import shutil
import tempfile
import logging
from fastapi import FastAPI, File, UploadFile, Form, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse, JSONResponse
from typing import List
import io
import pandas as pd
from screening_logger import save_screening_log   # NEW
from logs_store import save_log, load_logs
from datetime import datetime
import json

# Import centralized logging
from logging_config import setup_logging

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)

# Initialize logging
setup_logging()
logger = logging.getLogger(__name__)
logger.info("🚀 Backend API Started")

from ai_resume_screen import parse_jd, extract_text, analyze_resume
from jd_skill_extractor import extract_skills

app = FastAPI(title="Resume Screening API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://ps-ai-tool-mk0p.onrender.com",
        "https://*.onrender.com"   # optional
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

@app.get("/")
def root():
    logger.info("ROOT endpoint hit")
    return {"status": "ok"}

@app.get("/ping")
async def ping():
    logger.info("PING received")
    return {"status": "ok"}


# ======================================================
# UPLOAD JD
# ======================================================
@app.post("/upload-jd")
async def upload_jd(jd_file: UploadFile = File(None), jd_text: str = Form(None)):
    logger.info("📥 /upload-jd called")

    text = ""
    if jd_file:
        logger.info(f"JD file received: {jd_file.filename}")
        contents = await jd_file.read()
        logger.info(f"JD file size: {len(contents)} bytes")

        try:
            text = contents.decode("utf-8", errors="ignore")
            logger.info("JD decoded as UTF-8")
        except:
            logger.warning("JD decode failed — using extract_text()")
            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(jd_file.filename)[1])
            tmp.write(contents)
            tmp.flush()
            tmp.close()

            text = extract_text(tmp.name)
            os.unlink(tmp.name)

    elif jd_text:
        logger.info("Received JD text (not file)")
        logger.info(f"JD text length: {len(jd_text)} chars")
        text = jd_text

    else:
        logger.error("No JD provided!")
        raise HTTPException(status_code=400, detail="Provide jd_file or jd_text")

    logger.info("Calling parse_jd()")
    parsed = parse_jd(text)
    logger.info(f"JD Parsed Output: {parsed}")

    return JSONResponse(parsed)


# ======================================================
# EXTRACT JD KEYWORDS
# ======================================================
@app.post("/extract-jd-keywords")
async def extract_jd_keywords(jd_file: UploadFile = File(None), jd_text: str = Form(None)):
    logger.info("📥 /extract-jd-keywords called")

    text = ""
    if jd_file:
        logger.info(f"JD file received: {jd_file.filename}")
        contents = await jd_file.read()
        logger.info(f"JD file size: {len(contents)} bytes")

        try:
            text = contents.decode("utf-8", errors="ignore")
            logger.info("JD decoded as UTF-8")
        except:
            logger.warning("JD decode failed — using extract_text()")

            tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(jd_file.filename)[1])
            tmp.write(contents)
            tmp.flush()
            tmp.close()

            from jd_skill_extractor import extract_text
            text = extract_text(tmp.name)
            os.unlink(tmp.name)

    elif jd_text:
        logger.info("Received JD text input")
        text = jd_text
    else:
        logger.error("No JD provided")
        raise HTTPException(status_code=400, detail="Provide jd_file or jd_text")

    logger.info("Calling extract_skills()")
    parsed = extract_skills(text)
    logger.info(f"Extracted JD Skills: {parsed}")

    return JSONResponse(parsed)


# ======================================================
# ANALYZE RESUMES
# ======================================================
@app.post("/analyze-resumes")
async def analyze_resumes(jd_text: str = Form(...), resumes: List[UploadFile] = File(...), client: str = Form(""), role: str = Form("")):
    logger.info("📥 /analyze-resumes called")
    logger.info(f"JD Text length: {len(jd_text)} chars")
    logger.info(f"Total resumes received: {len(resumes)}")

    jd_skills = parse_jd(jd_text)
    logger.info(f"JD Skills Parsed: {jd_skills}")

    results = []
    workdir = tempfile.mkdtemp(prefix="resumes_")
    logger.info(f"Temp resume directory: {workdir}")

    try:
        for upload in resumes:
            filename = upload.filename
            logger.info(f"Processing resume: {filename}")

            tmp_path = os.path.join(workdir, filename)

            with open(tmp_path, "wb") as f:
                content = await upload.read()
                logger.info(f"Resume size: {len(content)} bytes")
                f.write(content)

            text = extract_text(tmp_path)
            logger.info(f"Extracted resume text length: {len(text)} chars")

            analysis = analyze_resume(jd_skills, text)
            logger.info(f"Resume analysis output: {analysis}")

            result = {"Name": filename, **analysis}
            results.append(result)

    finally:
        logger.info("Cleaning temp directory")
        shutil.rmtree(workdir, ignore_errors=True)

        logger.info("Returning analysis result")

    # ============================
    # NEW FEATURE — SCREENING LOG
    # ============================
    try:
        # client = jd_skills.get("client", "")
        # role = jd_skills.get("role", "")
        key_skills = jd_skills.get("primarySkills") or jd_skills.get("primary", [])

        # selected_profiles = [
        #     r["Name"] for r in results if r.get("Status") == "Selected"
        # ]
        all_profiles = [r["Name"] for r in results]
        total_profiles = len(all_profiles)

        selected_profiles = [r["Name"] for r in results if r.get("Status") == "Selected"]

        rejected_profiles = list(set(all_profiles) - set(selected_profiles))
        save_screening_log(
            client=client,
            role=role,
            key_skills=key_skills,
            total_profiles=total_profiles,
            selected_profiles=selected_profiles,
            rejected_profiles=rejected_profiles
            )

    except Exception as log_error:
        logger.error("❌ Screening logging failed")
        logger.exception(log_error)

    return {"results": results}

# ===============================
# SCREENING LOGS (READ)
# ===============================
@app.get("/logs/screening")
async def get_screening_logs():
    try:
        if not os.path.exists("screening_logs.json"):
            return []

        with open("screening_logs.json", "r", encoding="utf-8") as f:
            return json.load(f)

    except Exception as e:
        logger.error("❌ Failed to read screening logs")
        logger.exception(e)
        return []

# ======================================================
# EXPORT EXCEL
# ======================================================
@app.post("/export-excel")
async def export_excel(results: List[dict]):
    logger.info("📤 /export-excel called")
    logger.info(f"Total results received: {len(results)}")

    df = pd.DataFrame(results)
    logger.info("Converted results to DataFrame")

    output = io.BytesIO()
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        df.to_excel(writer, index=False)
        logger.info("Excel file written successfully")

    output.seek(0)
    headers = {'Content-Disposition': 'attachment; filename="results.xlsx"'}

    logger.info("Returning Excel file")
    return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)


# # backend/app.py
# import os
# import shutil
# import tempfile
# import logging
# from fastapi import FastAPI, File, UploadFile, Form, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import StreamingResponse, JSONResponse
# from typing import List
# import io
# import pandas as pd
# from screening_logger import save_screening_log   # NEW
# from logs_store import save_log, load_logs
# import json

# # Import centralized logging
# from logging_config import setup_logging

# if __name__ == "__main__":
#     import uvicorn
#     port = int(os.environ.get("PORT", 8000))
#     uvicorn.run("app:app", host="0.0.0.0", port=port, reload=True)

# # Initialize logging
# setup_logging()
# logger = logging.getLogger(__name__)
# logger.info("🚀 Backend API Started")

# from ai_resume_screen import extract_text, analyze_resume
# from jd_skill_extractor import parse_jd, extract_skills  # LLM already removed

# app = FastAPI(title="Resume Screening API")

# # ======================================================
# # CORS
# # ======================================================
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=[
#         "http://localhost:3000",
#         "https://ps-ai-tool-mk0p.onrender.com",
#         "https://*.onrender.com"
#     ],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # ======================================================
# # ROOT / PING
# # ======================================================
# @app.get("/")
# def root():
#     logger.info("ROOT endpoint hit")
#     return {"status": "ok"}

# @app.get("/ping")
# async def ping():
#     logger.info("PING received")
#     return {"status": "ok"}

# # ======================================================
# # UPLOAD JD
# # ======================================================
# @app.post("/upload-jd")
# async def upload_jd(jd_file: UploadFile = File(None), jd_text: str = Form(None)):
#     logger.info("📥 /upload-jd called")
#     text = ""

#     if jd_file:
#         contents = await jd_file.read()
#         try:
#             text = contents.decode("utf-8", errors="ignore")
#         except:
#             tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(jd_file.filename)[1])
#             tmp.write(contents)
#             tmp.flush()
#             tmp.close()
#             from jd_skill_extractor import extract_text
#             text = extract_text(tmp.name)
#             os.unlink(tmp.name)
#     elif jd_text:
#         text = jd_text
#     else:
#         raise HTTPException(status_code=400, detail="Provide jd_file or jd_text")

#     parsed = parse_jd(text)
#     return JSONResponse(parsed)

# # ======================================================
# # EXTRACT JD KEYWORDS
# # ======================================================
# @app.post("/extract-jd-keywords")
# async def extract_jd_keywords(jd_file: UploadFile = File(None), jd_text: str = Form(None)):
#     logger.info("📥 /extract-jd-keywords called")
#     text = ""

#     if jd_file:
#         contents = await jd_file.read()
#         try:
#             text = contents.decode("utf-8", errors="ignore")
#         except:
#             tmp = tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(jd_file.filename)[1])
#             tmp.write(contents)
#             tmp.flush()
#             tmp.close()
#             from jd_skill_extractor import extract_text
#             text = extract_text(tmp.name)
#             os.unlink(tmp.name)
#     elif jd_text:
#         text = jd_text
#     else:
#         raise HTTPException(status_code=400, detail="Provide jd_file or jd_text")

#     parsed = extract_skills(text)
#     return JSONResponse(parsed)

# # ======================================================
# # ANALYZE RESUMES
# # ======================================================
# @app.post("/analyze-resumes")
# async def analyze_resumes(jd_text: str = Form(...), resumes: List[UploadFile] = File(...), client: str = Form(""), role: str = Form("")):
#     logger.info("📥 /analyze-resumes called")
#     jd_skills = parse_jd(jd_text)

#     results = []
#     workdir = tempfile.mkdtemp(prefix="resumes_")

#     try:
#         for upload in resumes:
#             filename = upload.filename
#             tmp_path = os.path.join(workdir, filename)
#             content = await upload.read()
#             with open(tmp_path, "wb") as f:
#                 f.write(content)

#             text = extract_text(tmp_path)
#             analysis = analyze_resume(jd_skills, text)
#             result = {"Name": filename, **analysis}
#             results.append(result)
#     finally:
#         shutil.rmtree(workdir, ignore_errors=True)

#     # SCREENING LOG
#     try:
#         key_skills = jd_skills.get("primarySkills") or jd_skills.get("primary", [])
#         all_profiles = [r["Name"] for r in results]
#         total_profiles = len(all_profiles)
#         selected_profiles = [r["Name"] for r in results if r.get("Status") == "Selected"]
#         rejected_profiles = list(set(all_profiles) - set(selected_profiles))

#         save_screening_log(
#             client=client,
#             role=role,
#             key_skills=key_skills,
#             total_profiles=total_profiles,
#             selected_profiles=selected_profiles,
#             rejected_profiles=rejected_profiles
#         )
#     except Exception as log_error:
#         logger.error("❌ Screening logging failed")
#         logger.exception(log_error)

#     return {"results": results}

# # ======================================================
# # SCREENING LOGS READ
# # ======================================================
# @app.get("/logs/screening")
# async def get_screening_logs():
#     if not os.path.exists("screening_logs.json"):
#         return []
#     with open("screening_logs.json", "r", encoding="utf-8") as f:
#         return json.load(f)

# # ======================================================
# # EXPORT EXCEL
# # ======================================================
# @app.post("/export-excel")
# async def export_excel(results: List[dict]):
#     df = pd.DataFrame(results)
#     output = io.BytesIO()
#     with pd.ExcelWriter(output, engine="openpyxl") as writer:
#         df.to_excel(writer, index=False)
#     output.seek(0)
#     headers = {'Content-Disposition': 'attachment; filename="results.xlsx"'}
#     return StreamingResponse(output, media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", headers=headers)
