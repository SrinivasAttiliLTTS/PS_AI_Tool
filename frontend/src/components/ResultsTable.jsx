

// src/components/ResultsTable.jsx
// // ResultsTable.jsx — Professional UI with candidate name = resume filename
import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Button, Card, CardHeader, CardContent } from "@mui/material";
import { saveAs } from "file-saver";
export default function ResultsTable({ rows, jdParsed }) {
  const cols = [
    { field: "Name", headerName: "Candidate", flex: 1 },
    { field: "Strengths", headerName: "Strengths", flex: 1.2 },
    { field: "Missing Primary", headerName: "Missing Primary", flex: 1 },
    { field: "Missing Secondary", headerName: "Missing Secondary", flex: 1 },
    { field: "Years of Experience", headerName: "Yrs Exp", width: 90 },
    { field: "Primary Score", headerName: "Primary %", width: 100 },
    { field: "Secondary Score", headerName: "Secondary %", width: 110 },
    { field: "Overall Score", headerName: "Overall %", width: 100 },
    { field: "Status", headerName: "Status", width: 110 },
  ];

  const exportCSV = () => {
    const csvRows = [];

    // Candidate headers
    csvRows.push(cols.map((c) => c.headerName).join(","));

    // Candidate data
    rows.forEach((r) => {
      csvRows.push(
        cols
          .map((c) => `"${String(r[c.field] || "").replace(/,/g, " ")}"`)
          .join(",")
      );
    });

    // Add 2 empty rows
    csvRows.push("");
    csvRows.push("");

    // Add primary skills row
    if (jdParsed?.primarySkills?.length) {
      csvRows.push(`Primary: ${jdParsed.primarySkills.join(", ")}`);
    }

    // Add 1 empty row
    csvRows.push("");

    // Add secondary + other in the same row
    const secondary = jdParsed?.secondarySkills?.join("  ") || "";
    const other = jdParsed?.otherSkills?.join("  ") || "";
    if (secondary || other) {
      csvRows.push(`Secondary: ${secondary}`);
      csvRows.push(`Other: ${other}`);
    }

    const csvContent = csvRows.join("\n");
    // saveAs(new Blob([csvContent], { type: "text/csv" }), "results.csv");
    // -----------------------------------------------------
  // ✔️ Create dynamic file name: client_role_datetime.csv
  // -----------------------------------------------------
  const client = jdParsed?.client || "Client";
  const role = jdParsed?.role || "Role";

  const now = new Date();
  const dt =
    now.getFullYear().toString() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0");
    // String(now.getSeconds()).padStart(2, "0");

  const safeClient = client.replace(/[^a-zA-Z0-9-_]/g, "");
  const safeRole = role.replace(/[^a-zA-Z0-9-_]/g, "");
  const filename = `${safeClient}_${safeRole}_${dt}.csv`;

  saveAs(new Blob([csvContent], { type: "text/csv" }), filename);
  };

  return (
    <Card sx={{ borderRadius: 2, mt: 3 }}>
      <CardHeader title="Candidate Match Results" sx={{ background: "#f8f9fb" }} />
      <CardContent>
        <Box sx={{ mb: 2 }}>
          <Button variant="outlined" onClick={exportCSV}>
            Export CSV
          </Button>
        </Box>

        <Box sx={{ height: 420 }}>
          <DataGrid
            rows={rows.map((r, i) => ({ id: i, ...r }))}
            columns={cols}
            pageSize={10}
          />
        </Box>
      </CardContent>
    </Card>
  );
}

