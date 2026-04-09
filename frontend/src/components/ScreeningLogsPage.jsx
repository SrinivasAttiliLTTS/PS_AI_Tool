// src/components/ScreeningLogsPage.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { Box, Divider } from "@mui/material";
import ScreeningFilterBar from "../components/ScreeningFilterBar";
import ScreeningResultsTable from "../components/ScreeningResultsTable";
import ScreeningCharts from "../components/ScreeningCharts";
import API_BASE from "../config/apiConfig"
import html2canvas from "html2canvas";
import { IconButton, Tooltip, Paper, Typography } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DownloadIcon from "@mui/icons-material/Download";
import EmailIcon from "@mui/icons-material/Email";
/* ================= HELPER: QUARTER START ================= */
// const getQuarterStart = (date = new Date()) => {
//   const month = date.getMonth(); // 0-11
//   const quarterStartMonth = Math.floor(month / 3) * 3;
//   return new Date(date.getFullYear(), quarterStartMonth, 1);
// };

const getQuarterStart = (date = new Date()) => {
  const month = date.getMonth();
  const quarterStartMonth = Math.floor(month / 3) * 3;

  // 👇 Set time to noon to avoid timezone shift
  return new Date(
    date.getFullYear(),
    quarterStartMonth,
    1,
    12, 0, 0
  );
};

export default function ScreeningLogsPage() {
  const loggedInUser = localStorage.getItem("username") || "";
  const exportRef = useRef(null);
  /* ================= STATE ================= */
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    startDate: getQuarterStart(), // ✅ Quarter start
    endDate: new Date(),          // ✅ Today
    client: "",                   // ✅ ALL
    username: loggedInUser,       // ✅ My username
  });

  /* ================= FETCH LOGS ================= */
  useEffect(() => {
    fetch(`${API_BASE}/logs/screening`)
      .then((res) => res.json())
      .then(setLogs)
      .catch(() => setLogs([]));
  }, []);

  /* ================= FILTERED LOGS ================= */
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const logDate = new Date(log.GeneratedOn);

      if (filters.startDate && logDate < filters.startDate) return false;
      if (filters.endDate && logDate > filters.endDate) return false;
      if (filters.client && log.Client !== filters.client) return false;
      if (filters.username && log.Username !== filters.username) return false;

      return true;
    });
  }, [logs, filters]);

  /* ================= AGGREGATION FOR TABLE ================= */
  const aggregatedRows = useMemo(() => {
    const map = {};

    filteredLogs.forEach((log) => {
      const key = `${log.Username}-${log.Client || "ALL"}`;

      if (!map[key]) {
        map[key] = {
          user: log.Username,
          account: log.Client || "ALL",
          profiles: 0,
          rejected: 0,
          selected: 0,
        };
      }

      map[key].profiles += log.TotalProfiles || 0;
      map[key].rejected += log.RejectedCount || 0;
      map[key].selected += log.Count || 0;
    });

    return Object.values(map);
  }, [filteredLogs]);

  const captureImage = async () => {
    const element = exportRef.current;

    // 👇 Scroll to top before capture
    window.scrollTo(0, 0);

    // 👇 Wait for UI to settle
    await new Promise((r) => setTimeout(r, 500));

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      scrollY: -window.scrollY,   // 🔥 Fix cropping
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    return canvas;
  };

  // Copy to Clipboard
  const handleCopy = async () => {
    try {
      const canvas = await captureImage();

      const blob = await new Promise((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) throw new Error("Blob creation failed");

      // ✅ Modern browsers (Chrome, Edge)
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
        ]);
        alert("Image copied! Paste with Ctrl+V");
      } else {
        // ❗ Safari fallback
        const img = document.createElement("img");
        img.src = URL.createObjectURL(blob);

        const w = window.open("");
        w.document.write(img.outerHTML);

        alert("Right click → copy image manually (Safari fallback)");
      }
    } catch (err) {
      console.error("Clipboard failed:", err);
      alert("Copy failed. Try download instead.");
    }
  };
  // const handleCopy = async () => {
  //   const canvas = await captureImage();

  //   canvas.toBlob(async (blob) => {
  //     try {
  //       await navigator.clipboard.write([
  //         new ClipboardItem({ "image/png": blob }),
  //       ]);
  //       alert("Copied to clipboard!");
  //     } catch (err) {
  //       console.error(err);
  //     }
  //   });
  // };

  // Download Image
  const handleDownload = async () => {
    setLoading(true);
    const canvas = await captureImage();
    setLoading(false);

    const link = document.createElement("a");
    link.download = "screening-report.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Email (Outlook)
  const handleEmail = () => {
    const email = localStorage.getItem("username") || "";

    const subject = encodeURIComponent("Screening Report");
    const body = encodeURIComponent(
      "Hi,\n\nPlease paste the copied report image here.\n\nRegards"
    );

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <Box>
      <Box ref={exportRef} sx={{ mt: 5 }}>
        <Box >
          <Box
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "#fff",
    borderBottom: "1px solid #e0e0e0",
    px: 2,
    py: 1,
    mb: 2,

    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  }}
>
  {/* ===== LEFT: FILTER ===== */}
  <Box sx={{ flex: 1 }}>
    <ScreeningFilterBar
      logs={logs}
      filters={filters}
      onChange={setFilters}
    />
  </Box>

  {/* ===== RIGHT: ACTIONS ===== */}
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      gap: 1.5,
      ml: 2,
    }}
  >
    <Tooltip title="Copy Report (Step 1)">
      <IconButton onClick={handleCopy} color="primary">
        <ContentCopyIcon />
      </IconButton>
    </Tooltip>

    <Tooltip title="Download Image">
      <IconButton onClick={handleDownload} color="success">
        <DownloadIcon />
      </IconButton>
    </Tooltip>

    <Tooltip title="Email (Step 2: Paste image)">
      <IconButton onClick={handleEmail} color="secondary">
        <EmailIcon />
      </IconButton>
    </Tooltip>
  </Box>
</Box>
          {/* ===== DONUT CHARTS (FILTERED) ===== */}
          <ScreeningCharts logs={filteredLogs} />
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ===== RESULTS TABLE ===== */}
      <ScreeningResultsTable rows={aggregatedRows} />

      {loading && (
        <Typography variant="caption" sx={{ ml: 2 }}>
          Generating image...
        </Typography>
      )}
    </Box>
  );
}
