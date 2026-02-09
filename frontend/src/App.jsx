// // src/App.jsx
// import React, { useState } from "react";
// import { Container, Typography, Box } from "@mui/material";
// import JDInput from "./components/JDInput";
// import ResumeUploader from "./components/ResumeUploader";
// import ResultsTable from "./components/ResultsTable";
// import LTTSLogo from "./assets/ltts-logo.png";
// import MenuIcon from "@mui/icons-material/Menu";
// import IconButton from "@mui/material/IconButton";
// import ScreeningHistory from "./components/ScreeningHistory";

// /**
//  * Build the final jdText string from parsed sections.
//  */
// function formatJDText(parsed, fallbackRawText = "") {
//   if (!parsed || typeof parsed !== "object") {
//     return fallbackRawText || "";
//   }

//   const normalize = (v) =>
//     Array.isArray(v)
//       ? v.filter(Boolean).map((s) => s.trim())
//       : String(v || "")
//           .split(",")
//           .map((s) => s.trim())
//           .filter(Boolean);

//   const primary = normalize(parsed.primarySkills);
//   const secondary = normalize(parsed.secondarySkills);
//   const other = normalize(parsed.otherSkills);

//   const lines = [];
//   if (primary.length) lines.push(`Primary: ${primary.join(", ")}`);
//   if (secondary.length) lines.push(`Secondary: ${secondary.join(", ")}`);
//   if (other.length) lines.push(`Other: ${other.join(", ")}`);

//   return lines.length ? lines.join("\n") : fallbackRawText || "";
// }

// function App() {
//   const [jdParsed, setJdParsed] = useState(null);
//   const [jdText, setJdText] = useState("");
//   const [results, setResults] = useState([]);
//   const [openLogs, setOpenLogs] = useState(false);
//   const [openHistory, setOpenHistory] = useState(false);
//   const [client, setClient] = useState("");
//   const [role, setRole] = useState("");

//   return (
//     <Container maxWidth="lg" sx={{ py: 2}}>
//       <Box
//   sx={{
//     display: "grid",
//     gridTemplateColumns: "auto 1fr auto",
//     // alignItems: "center",
//     mb: 2,
//   }}
// >
//   {/* Left: Logo */}
//   <Box>
//     <img
//       src={LTTSLogo}
//       alt="LTTS"
//       style={{ height: 40 }}
//     />
//   </Box>

//   {/* Right: Hamburger menu */}
// <Box sx={{ textAlign: "right" }}>
//   <IconButton onClick={() => setOpenHistory(true)}>
//     <MenuIcon />
//   </IconButton>
// </Box>


//   {/* Right: empty spacer (keeps title centered) */}
//   <Box />
// </Box>
//   {/* Center: Title */}
// <Typography
//     variant="h3"
//     align="center"
//   >
//     PS AI Screening Tool
//   </Typography>



//       <JDInput
//         onParsed={(parsed, rawText) => {
//           setJdParsed(parsed);
//           const finalJDText = formatJDText(parsed, rawText);
//           setJdText(finalJDText);
//           setClient(parsed.client || "");
//           setRole(parsed.role || "");
//         }}
//       />

//       <ResumeUploader jdText={jdText} onResults={setResults} client={client} role={role}/>

//       <Box sx={{ mt: 3 }}>
//         <ResultsTable rows={Array.isArray(results) ? results : []} jdParsed={jdParsed} />
//         {/* <ResultsTable rows={Array.isArray(results) ? results : []} /> */}
//       </Box>

//       <ScreeningHistory
//   open={openHistory}
//   onClose={() => setOpenHistory(false)}
// />


//     </Container>
//   );
// }

// export default App;

// src/App.jsx
import React, { useState } from "react";
import { Container, Typography, Box, Button } from "@mui/material";

import JDInput from "./components/JDInput";
import ResumeUploader from "./components/ResumeUploader";
import ResultsTable from "./components/ResultsTable";
import ScreeningHistory from "./components/ScreeningHistory";
import Login from "./components/Login";

import LTTSLogo from "./assets/ltts-logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";

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

  // ---------- APP STATE ----------
  const [jdParsed, setJdParsed] = useState(null);
  const [jdText, setJdText] = useState("");
  const [results, setResults] = useState([]);
  const [openHistory, setOpenHistory] = useState(false);
  const [client, setClient] = useState("");
  const [role, setRole] = useState("");

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

      {/* JD INPUT */}
      <JDInput
        onParsed={(parsed, rawText) => {
          setJdParsed(parsed);
          setJdText(formatJDText(parsed, rawText));
          setClient(parsed.client || "");
          setRole(parsed.role || "");
        }}
      />

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
    </Container>
  );
}

export default App;

