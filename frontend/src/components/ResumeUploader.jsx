
// src/components/ResumeUploader.jsx
// ResumeUploader.jsx — supports immediate row display + correct result mapping
import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { analyzeResumes } from "../api/api";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";

export default function ResumeUploader({ jdText, onResults, client, role}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  // Immediately reflect filenames in results table
  const handleFiles = (e) => {
    const selected = [...e.target.files];
    setFiles(selected);

    const initialRows = selected.map((f) => ({
      Name: f.name,
      Strengths: "",
      "Missing Primary": "",
      "Missing Secondary": "",
      "Years of Experience": "",
      "Primary Score": "",
      "Secondary Score": "",
      "Overall Score": "",
      Status: "",
    }));

    onResults(initialRows);
  };

  const analyze = async () => {
    if (!jdText) return alert("Please parse JD first");
    if (files.length === 0) return;

    setLoading(true);
// NEW: debug
console.log("Client:", client);
console.log("Role:", role);
    try {
      const { results } = await analyzeResumes(jdText, files, client, role);

      // Merge backend result into existing rows
      const merged = results.map((r, i) => ({
        Name: files[i]?.name || `Candidate ${i + 1}`,
        Strengths: r.Strengths || "",
        "Missing Primary": r["Missing Primary"] || "",
        "Missing Secondary": r["Missing Secondary"] || "",
        "Years of Experience": r["Years of Experience"] || "",
        "Primary Score": r["Primary Score"] || "",
        "Secondary Score": r["Secondary Score"] || "",
        "Overall Score": r["Overall Score"] || "",
        Status: r.Status || "",
      }));

      onResults(merged);
    } catch (err) {
      console.error(err);
      alert("Analysis failed");
    }

    setLoading(false);
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardHeader
        title="Resume Upload"
        subheader="Upload candidate resumes"
        sx={{ background: "#f8f9fb" }}
      />
      <CardContent>
        <Box
          sx={{
            border: "2px dashed #c4c4c4",
            borderRadius: 2,
            p: 3,
            textAlign: "center",
            background: "#fafafa",
            cursor: "pointer",
          }}
        >
          <Button
          startIcon={<FileUploadIcon />}
  variant="outlined"
  component="label"
  fullWidth
  sx={{
    height: "40px",
    borderRadius: "8px",
    borderColor: "black",
    borderWidth: "1px",
    color: "black",                 // text color
    justifyContent: "flex-start",
    fontSize: "14px",
    textTransform: "none",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    "&:hover": {
      borderColor: "black",
      backgroundColor: "transparent",
    },
  }}
>
  {files?.length
    ? `${files.length} file(s) selected`
    : "Upload Resumes"}

  <input
    type="file"
    hidden
    multiple
    onChange={handleFiles}
  />
</Button>

          {/* <input
            type="file"
            multiple
            onChange={handleFiles}
            // style={{ width: "100%" }}
            style={{
              width: "100%",
    height: "40px",
    fontSize: "14px",   // <-- required for height to apply
    // padding: "12px",
    borderRadius: "8px",
  }}
          /> */}
        </Box>

        <Button
          variant="contained"
          disabled={loading || files.length === 0}
          onClick={analyze}
          sx={{ mt: 2 }}
        >
          Analyze Resumes
        </Button>
      </CardContent>
      {loading && (
  <Backdrop
    open={true}
    sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
)}
    </Card>
  );
}
