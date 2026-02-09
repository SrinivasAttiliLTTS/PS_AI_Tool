import axios from "axios";

// const API_BASE = "https://ps-ai-tool-mk0p.onrender.com"; 
const API_BASE = "https://yield-gps-share-choosing.trycloudflare.com";
// const API_BASE = "http://localhost:8000";
// const API_BASE = process.env.REACT_APP_API_BASE || "https://ai-resume-screen-backend.onrender.com";
export async function uploadJD(jdFile, jdText) {
  const fd = new FormData();
  if (jdFile) fd.append("jd_file", jdFile);
  if (jdText) fd.append("jd_text", jdText);
  const res = await axios.post(`${API_BASE}/upload-jd`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}

export async function analyzeResumes(jdText, files, client, role) {
  const email = localStorage.getItem("email");
  const fd = new FormData();
  fd.append("jd_text", jdText);
  for (let i = 0; i < files.length; i++) fd.append("resumes", files[i], files[i].name);
  fd.append("client", client || "");
  fd.append("role", role || "");
  fd.append("user", email || "");

  const res = await axios.post(`${API_BASE}/analyze-resumes`, fd, { headers: { "Content-Type": "multipart/form-data" } });
  return res.data;
}

export async function exportExcel(results) {
  const res = await axios.post(`${API_BASE}/export-excel`, results, { responseType: "blob" });
  return res.data;
}

export async function fetchScreeningLogs() {
  console.log("📡 Fetching screening logs...");
  const res = await fetch(`${BASE_URL}/logs/screening`);

  if (!res.ok) {
    throw new Error("Failed to fetch screening logs");
  }

  const data = await res.json();
  console.log("📄 Screening logs response:", data);
  return data;
}