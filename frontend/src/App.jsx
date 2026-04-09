// src/App.jsx
import React, { useState } from "react";
import { Container, Typography, Box, Button, Slider } from "@mui/material";
import JDInput from "./components/JDInput";
import ResumeUploader from "./components/ResumeUploader";
import ResultsTable from "./components/ResultsTable";
import ScreeningHistory from "./components/ScreeningHistory";
import Login from "./components/Login";

import LTTSLogo from "./assets/ltts-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import AssessmentDialog from "./components/AssessmentDialog";

function formatJDText(parsed, fallbackRawText = "") {
  if (!parsed || typeof parsed !== "object") return fallbackRawText || "";

  const normalize = (v) =>
    Array.isArray(v)
      ? v.filter(Boolean).map((s) => s.trim())
      : String(v || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

  const lines = [];
  const primary = normalize(parsed.primarySkills);
  const secondary = normalize(parsed.secondarySkills);
  const other = normalize(parsed.otherSkills);

  if (primary.length) lines.push(`Primary: ${primary.join(", ")}`);
  if (secondary.length) lines.push(`Secondary: ${secondary.join(", ")}`);
  if (other.length) lines.push(`Other: ${other.join(", ")}`);

  return lines.length ? lines.join("\n") : fallbackRawText || "";
}

function App() {
  // ---------- AUTH ----------
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [openAssessment, setOpenAssessment] = useState(false);
  const isAuthenticated = Boolean(token);

  const handleLogin = ({ token, email }) => {
    console.log("TOKEN RECEIVED:", token); // 🔍 debug
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    setToken(token);
    setEmail(email);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setEmail(null);
  };

  const THRESHOLD_ALLOWED_EMAILS = [
    "srinivasu.attili@ltts.com",
    "manjunath.hs@ltts.com",
    "madhu.balan@ltts.com",
    "sagar.patil@ltts.com"
    // "harini.arumugam@ltts.com"
  ];
  const canConfigureThreshold =
    email && THRESHOLD_ALLOWED_EMAILS.includes(email);

  // ---------- APP STATE ----------
  const [jdParsed, setJdParsed] = useState(null);
  const [jdText, setJdText] = useState("");
  const [results, setResults] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [client, setClient] = useState("");
  const [role, setRole] = useState("");
  const [selectionThreshold, setSelectionThreshold] = useState(65);
  // ---------- LOGIN ----------
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  // ---------- MAIN APP ----------
  return (
    <Container maxWidth="lg" sx={{ py: 2 }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "auto 1fr auto",
          mb: 2
        }}
      >
        {/* Left: Logo */}
        <img src={LTTSLogo} alt="LTTS" style={{ height: 40 }} />

        {/* Spacer */}
        <Box />

        {/* Right: User info + menu */}
        <Box sx={{ textAlign: "right" }}>
          <Typography variant="body2">{email}</Typography>
          <IconButton onClick={() => setOpenHistory(true)}>
            <MenuIcon />
          </IconButton>
          <Button size="small" onClick={logout}>
            Logout
          </Button>
        </Box>
      </Box>

      {/* TITLE */}
      <Typography variant="h3" align="center">
        PS AI Screening Tool
      </Typography>

      {/* <Box sx={{ mt: 2, textAlign: "center" }}>
        <Button
          variant="contained"
          color="secondary"
          disabled={!jdText}
          onClick={() => setOpenAssessment(true)}
        >
          Start Assessment
        </Button>

        {!jdText && (
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            Upload or enter JD to enable assessment
          </Typography>
        )}
      </Box> */}
      {/* JD INPUT */}
      <JDInput
        onParsed={(parsed, rawText) => {
          setJdParsed(parsed);
          setJdText(formatJDText(parsed, rawText));
          setClient(parsed.client || "");
          setRole(parsed.role || "");
        }}
      />

      {canConfigureThreshold && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            border: "1px solid #e0e0e0",
            borderRadius: 2,
            backgroundColor: "#fafafa"
          }}
        >
          <Typography variant="subtitle1" gutterBottom>
            Candidate Selection Criteria
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Candidates with an overall score equal to or above this percentage will be marked as <b>Selected</b>.
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box sx={{ flex: 1 }}>
              <Slider
                value={selectionThreshold}
                min={50}
                max={90}
                step={1}
                marks={[
                  { value: 50, label: "50%" },
                  { value: 65, label: "65%" },
                  { value: 80, label: "80%" }
                ]}
                valueLabelDisplay="auto"
                onChange={(_, value) => setSelectionThreshold(value)}
              />
            </Box>

            <Box sx={{ minWidth: 80, textAlign: "center" }}>
              <Typography variant="h6">
                {selectionThreshold}%
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
      {/* RESUME UPLOADER */}
      {/* RESULTS TABLE (Upload + Analyze + Export inside header) */}
      <Box sx={{ mt: 3 }}>
        <ResultsTable
          rows={results || []}
          setRows={setResults}
          jdParsed={jdParsed}
          jdText={jdText}
          client={client}
          role={role}
          email={email}
          selectionThreshold={selectionThreshold}
        />
      </Box>
      {/* <ResumeUploader
        jdText={jdText}
        onResults={setResults}
        client={client}
        role={role}
      /> */}

      {/* RESULTS TABLE */}
      {/* <Box sx={{ mt: 3 }}>
        <ResultsTable rows={results || []} jdParsed={jdParsed} email={email} />
      </Box> */}

      {/* SCREENING HISTORY */}
      <ScreeningHistory
        open={openHistory}
        onClose={() => setOpenHistory(false)}
      />
      <AssessmentDialog
        open={openAssessment}
        onClose={() => setOpenAssessment(false)}
        jdText={jdText}
        candidate={{ Name: email || "User" }}
      />
    </Container>
  );
}

export default App;

