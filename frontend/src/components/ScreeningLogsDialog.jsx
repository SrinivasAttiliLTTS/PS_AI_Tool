import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ScreeningLogsDialog({ open, onClose }) {
  const [logs, setLogs] = useState([]);

useEffect(() => {
  if (!open) return;

  console.log("📡 Fetching screening logs...");

  // fetch("http://localhost:10000/logs/screening")
  fetch("https://ps-ai-tool-mk0p.onrender.com/logs/screening")
    .then((res) => {
      console.log("✅ Response status:", res.status);
      return res.json();
    })
    .then((data) => {
      console.log("📄 Screening logs response:", data);
      setLogs(data);
    })
    .catch((err) => {
      console.error("❌ Error fetching screening logs:", err);
      setLogs([]);
    });
}, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        Screening History
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {logs.length === 0 ? (
          <Typography>No screening logs available</Typography>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Generated On</TableCell>
                <TableCell>Client</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Key Skills</TableCell>
                <TableCell>Selected Count</TableCell>
                <TableCell>Selected</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.map((log, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    {new Date(log.GeneratedOn).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.Client}</TableCell>
                  <TableCell>{log.Role}</TableCell>
                  <TableCell>
                    {(log.KeySkill || []).join(", ")}
                  </TableCell>
                  <TableCell>{log.Count}</TableCell>
                  <TableCell>
                    {log.Selected ? "Yes" : "No"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
