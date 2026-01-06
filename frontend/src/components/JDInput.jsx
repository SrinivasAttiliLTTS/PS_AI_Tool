// src/components/JDInput.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Chip,
  IconButton,
  Divider,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import UploadIcon from "@mui/icons-material/UploadFile";
import { uploadJD } from "../api/api"; // keep your existing api for resume upload
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// -------------------------
// Local Storage Helpers
// -------------------------
const STORAGE_KEY = "jd_store_v1";

const loadStore = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveStore = (items) =>
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));

// -------------------------
// JD Text Parser
// -------------------------
const parseCombinedJDText = (text) => {
  const pick = (label) => {
    const regex = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(Primary|Secondary|Other)\\s*:|$)`, "i");
  const match = text.match(regex);
  return match
    ? match[1]
        .trim()
        .split(/\n+/)   // split by new line
        .map((x) => x.trim())
        .filter(Boolean)
    : [];
    //   const regex = new RegExp(`${label}\\s*:\\s*([\\s\\S]*?)(?=\\n\\s*(Primary|Secondary|Other)\\s*:|$)`, "i");
    // const m = text.match(
    //   regex
    //   // new RegExp(`^${label}\\s*:\\s*(.*)$`, "mi")
    // );
    // return m ? m[1] : "";
  };
  // console.log(text);
console.log(pick("Primary"));
console.log(pick("Secondary"));
console.log(pick("Other"));

  const arr = (s) =>
    (s || "")
      // .split(" ")
      // .map((x) => x.trim())
      // .filter(Boolean);

  return {
    primarySkills: arr(pick("Primary")),
    secondarySkills: arr(pick("Secondary")),
    otherSkills: arr(pick("Other")),
  };
};

// ==========================================================
// COMPONENT
// ==========================================================
export default function JDInput({ onParsed }) {
  const [primary, setPrimary] = useState("");
  const [secondary, setSecondary] = useState("");
  const [other, setOther] = useState("");
  const [jdName, setJdName] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [library, setLibrary] = useState([]);
  const [filter, setFilter] = useState("");
// NEW: Client & Role state
const [client, setClient] = useState("");
const [role, setRole] = useState("");

  useEffect(() => {
    setLibrary(loadStore());
  }, []);

  const buildCombinedJDText = () => {
    const lines = [];
    if (primary) lines.push(`Primary: ${primary}`);
    if (secondary) lines.push(`Secondary: ${secondary}`);
    if (other) lines.push(`Other: ${other}`);
    return lines.join("\n");
  };

  const handleSave = () => {
    if (!jdName.trim()) return alert("Please enter a JD name.");

    const jdText = buildCombinedJDText();
    if (!jdText) return alert("Enter at least one skill before saving.");

    const list = loadStore();
    const exists = list.findIndex((x) => x.name === jdName.trim());

    const entry = {
      name: jdName.trim(),
      jdText,
      createdAt: Date.now(),
    };

    if (exists >= 0) list[exists] = entry;
    else list.unshift(entry);

    saveStore(list);
    setLibrary(list);
  };

  // -------------------------
  // HANDLE PARSE JD
  // -------------------------
  const handleUpload = async () => {
    if (!file && !buildCombinedJDText()) {
      return alert("Please select a file or enter JD text.");
    }

    setLoading(true);
    try {
      const formData = new FormData();
      if (file) formData.append("jd_file", file);
      if (buildCombinedJDText()) formData.append("jd_text", buildCombinedJDText());
      
      const response = await 
      // fetch("http://localhost:8000/extract-jd-keywords",
      fetch("https://freedom-gene-mortgage-what.trycloudflare.com/extract-jd-keywords",

      // fetch("https://ps-ai-tool-mk0p.onrender.com/extract-jd-keywords",
         {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`JD parsing failed: ${error}`);
      }

      const data = await response.json();
      // Update state fields
      setPrimary(data.primarySkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));
      setSecondary(data.secondarySkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));
      setOther(data.otherSkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));

console.log(data);
      // onParsed(data, buildCombinedJDText());
// NEW: include client & role
onParsed(
  {
    ...data,
    client,
    role,
  },
  buildCombinedJDText()
);
      // Save automatically if JD name provided
      if (jdName.trim()) handleSave();
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoad = (item) => {
    const parsed = parseCombinedJDText(item.jdText);
    setPrimary(parsed.primarySkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));
    setSecondary(parsed.secondarySkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));
    setOther(parsed.otherSkills.join(", ").split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n"));
    setJdName(item.name);
    setClient("");
    setRole("");
    onParsed(parsed, item.jdText);
  };

  const handleDelete = (name) => {
    const list = loadStore().filter((x) => x.name !== name);
    saveStore(list);
    setLibrary(list);
  };

  const filtered = library.filter((x) =>
    x.name.toLowerCase().includes(filter.toLowerCase())
  );

  // ==========================================================
  // UI
  // ==========================================================
  return (
    <Box sx={{ mb: 4 }}>
      <Grid container spacing={3}>
        {/* LEFT: JD INPUT */}
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              borderRadius: 2,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              height: "600px",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <CardHeader
              title="Job Description — Skills"
              subheader="Enter comma-separated skills for each section"
              sx={{ background: "#f8f9fb" }}
            />

            <CardContent sx={{ overflowY: "auto" }}>
              <Stack spacing={3}>
                {/* SKILL INPUT FIELDS */}
                <Grid container spacing={2}>

  {/* PRIMARY SKILLS */}
  <Grid item xs={12} md={4}>
    <TextField
  fullWidth
  label="Primary Skills"
  multiline
  value={primary}
  onChange={(e) => setPrimary(e.target.value)}   // user types freely
  onBlur={() =>
    setPrimary(
      primary
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .join("\n")  // convert to multiline format
    )
  }
  sx={{
    "& .MuiInputBase-root": {
      minHeight: 280,
      maxHeight: 280,
      overflowY: "auto",
    },
  }}
/>


  </Grid>

  {/* SECONDARY SKILLS */}
  <Grid item xs={12} md={4}>
  
<TextField
  fullWidth
  label="Secondary Skills"
  multiline
  value={secondary}
  onChange={(e) => setSecondary(e.target.value)}   // user types freely
  onBlur={() =>
    setSecondary(
      secondary
        .split(",")
        .map(s => s.trim())
        .filter(Boolean)
        .join("\n")   // convert to multiline format
    )
  }
  sx={{
    "& .MuiInputBase-root": {
      minHeight: 280,
      maxHeight: 280,
      overflowY: "auto",
    },
  }}
/>

  </Grid>

  {/* OTHER SKILLS */}
  <Grid item xs={12} md={4}>

<TextField
  fullWidth
  label="Other Skills"
  multiline
  value={other}
  onChange={(e) => setOther(e.target.value)}   // user types freely
  onBlur={() =>
    setOther(
      other
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n")
        // .split("\n")
        // .map(s => s.trim())
        // .filter(Boolean)
        // .join("\n")   // convert to multiline format
    )
  }
  sx={{
    "& .MuiInputBase-root": {
      minHeight: 280,
      maxHeight: 280,
      overflowY: "auto",
    },
  }}
/>

    {/* <TextField
  fullWidth
  label="Other Skills"
  multiline
  value={
    other
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .join("\n")
  }
  onChange={(e) =>
    setOther(
      e.target.value
        .split("\n")
        .map(s => s.trim())
        .filter(Boolean)
        .join(", ")
    )
  }
  sx={{
    "& .MuiInputBase-root": {
      minHeight: 280,
      maxHeight: 280,
      overflowY: "auto",
    },
  }}
/> */}

  </Grid>

</Grid>

{/* NEW: Client & Role Input */}
<Grid container spacing={2}>
  <Grid item xs={6}>
    <TextField
      fullWidth
      label="Client"
      placeholder="Ex: LTTS / TCS / Internal"
      value={client}
      onChange={(e) => setClient(e.target.value)}
    />
  </Grid>

  <Grid item xs={6}>
    <TextField
      fullWidth
      label="Role"
      placeholder="Ex: Senior React Developer"
      value={role}
      onChange={(e) => setRole(e.target.value)}
    />
  </Grid>
</Grid>
                <Divider />

                {/* JD NAME */}
                <Grid container spacing={2}>
                  <Grid item xs={9}>
                    <TextField
                      fullWidth
                      label="JD Name"
                      placeholder="react_fe_acme"
                      value={jdName}
                      onChange={(e) => setJdName(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SaveIcon />}
                      onClick={handleSave}
                    >
                      Save
                    </Button>
                  </Grid>
                </Grid>

                {/* <Divider /> */}

                
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RIGHT: SAVED JDs */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 2,
              height: "600px",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              overflow: "hidden",
            }}
          >
            <CardHeader
              title="Saved JDs"
              subheader="Click ‘Load’ to reuse"
              sx={{ background: "#f8f9fb" }}
            />

            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                minHeight: 0,
              }}
            >
              {/* Search bar */}
              <TextField
                size="small"
                fullWidth
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                sx={{ mb: 2 }}
              />

              {/* Scrollable JD List */}
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: "auto",
                  pr: 1,
                  minHeight: 0,
                }}
              >
                {filtered.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">
                    No saved JDs yet.
                  </Typography>
                ) : (
                  filtered.map((entry) => {
                    const parsed = parseCombinedJDText(entry.jdText);

                    return (
                      <Box
                        key={entry.name}
                        sx={{
                          mb: 1.5,
                          p: 1.5,
                          borderRadius: 1.5,
                          background: "#fafafa",
                          border: "1px solid #e5e5e5",
                        }}
                      >
                        {/* Header Row */}
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 0.6,
                          }}
                        >
                          <Typography
                            noWrap
                            sx={{ fontWeight: 600, fontSize: "0.9rem" }}
                            title={entry.name}
                          >
                            {entry.name}
                          </Typography>

                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{ fontSize: "0.7rem" }}
                              onClick={() => handleLoad(entry)}
                            >
                              Load
                            </Button>

                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(entry.name)}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>

                        {/* Date */}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(entry.createdAt).toLocaleString()}
                        </Typography>

                        {/* Skill chips */}
                        <Box
                          sx={{
                            mt: 1,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 0.6,
                          }}
                        >
                          {[...parsed.primarySkills, ...parsed.secondarySkills]
                            .slice(0, 5)
                            .map((skill, idx) => (
                              <Chip
                                key={idx}
                                label={skill}
                                size="small"
                                variant="outlined"
                                sx={{ fontSize: "0.65rem", height: 20 }}
                              />
                            ))}

                          {parsed.primarySkills.length +
                            parsed.secondarySkills.length >
                            5 && (
                            <Chip
                              label="+ more"
                              size="small"
                              sx={{
                                fontSize: "0.65rem",
                                height: 20,
                                background: "#eee",
                              }}
                            />
                          )}
                        </Box>
                      </Box>
                    );
                  })
                )}
              </Box>
            </CardContent>

            {/* FILE + PARSE BUTTON */}
                <Stack direction="row" spacing={0} alignItems="center" justifyContent={"space-around"}>
                  <input
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={(e) => setFile(e.target.files[0])}
                    style={{
    height: "40px",
    fontSize: "11px",   // <-- required for height to apply
    // padding: "12px",
    borderRadius: "8px",
  }}
                  />

                  <Grid item xs={4}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<SaveIcon />}
                    onClick={handleUpload}
                    >
                      Parse JD
                    </Button>
                  </Grid>

                  {/* <Button
                    variant="contained"
                    startIcon={<UploadIcon />}
                    disabled={loading}
                    onClick={handleUpload}
                  >
                    Parse JD
                  </Button> */}
                </Stack>
          </Card>
          
        </Grid>
        
      </Grid>
      
      {/* GLOBAL LOADER */}
      {loading && (
        <Backdrop
          open={true}
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        >
        <CircularProgress color="inherit" />
      </Backdrop>
      )}
    </Box>
  );
}
