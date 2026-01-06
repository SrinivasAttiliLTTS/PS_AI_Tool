// src/components/ScreeningCharts.jsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#f44336"];

export default function ScreeningCharts({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <Typography align="center" color="text.secondary">
        No screening data available
      </Typography>
    );
  }

  // ----------------------------
  // KPI CALCULATIONS
  // ----------------------------
const totalProfiles = logs.reduce((s, l) => s + l.TotalProfiles, 0);
const selectedProfiles = logs.reduce((s, l) => s + (l.Count || 0), 0);
const rejectedProfiles = logs.reduce((s, l) => s + (l.RejectedCount || 0), 0);

  const totalRuns = logs.length;
//   const totalProfiles = logs.reduce((s, l) => s + l.Count, 0);
//   const selectedProfiles = logs
//   .filter(l => l.Selected)
//   .reduce((s, l) => s + l.Count, 0);
//   const rejectedProfiles = totalProfiles - selectedProfiles;

//   const totalRuns = logs.length;
//   const totalSelected = logs.reduce((s, l) => s + l.Count, 0);
//   const totalRejected = logs.reduce(
//     (s, l) => s + (l.Selected ? 0 : 1),
//     0
//   );

  // ----------------------------
  // PIE DATA
  // ----------------------------
  const groupBy = (key) => {
    const map = {};
    logs.forEach((l) => {
      const k = l[key] || "Unknown";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map).map(([name, value]) => ({
      name,
      value,
    }));
  };

  const clientData = groupBy("Client");
  const roleData = groupBy("Role");

  // ----------------------------
  // BAR DATA
  // ----------------------------
  const dateMap = {};

logs.forEach((l) => {
  const d = new Date(l.GeneratedOn).toLocaleDateString();
  
  if (!dateMap[d]) {
    dateMap[d] = { date: d, selected: 0, rejected: 0 };
  }

  // Add counts from JSON
  dateMap[d].selected += l.Count || 0;         // Selected profiles
  dateMap[d].rejected += l.RejectedCount || 0; // Rejected profiles
});

const barData = Object.values(dateMap);

//   const dateMap = {};
//   logs.forEach((l) => {
//     const d = new Date(l.GeneratedOn).toLocaleDateString();
//     if (!dateMap[d]) dateMap[d] = { date: d, selected: 0, rejected: 0 };
//     l.Selected ? dateMap[d].selected++ : dateMap[d].rejected++;
//   });

//   const barData = Object.values(dateMap);

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <Box sx={{ p: 2 }}>
      {/* ================= KPI ROW ================= */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {[
  { label: "Screening Runs", value: totalRuns },
  { label: "Profiles Screened", value: totalProfiles },
  { label: "Profiles Selected", value: selectedProfiles },
  { label: "Profiles Rejected", value: rejectedProfiles },
].map((kpi, i) => (
  <Grid item xs={12} md={3} key={i}>
    <Card sx={{ textAlign: "center" }}>
      <CardContent>
        <Typography variant="h4" fontWeight={600}>
          {kpi.value}
        </Typography>
        <Typography color="text.secondary">
          {kpi.label}
        </Typography>
      </CardContent>
    </Card>
  </Grid>
))}

      </Grid>

      {/* ================= PIE CHARTS ================= */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        {/* Client */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Screening by Client
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={clientData} dataKey="value" label>
                    {clientData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Role */}
        <Grid item xs={12} md={6}>
          <Card sx={{ height: 360 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Screening by Role
              </Typography>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie data={roleData} dataKey="value" label>
                    {roleData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================= BAR CHART ================= */}
      <Grid container>
        <Grid item xs={12}>
          <Card sx={{ height: 420 }}>
            <CardContent>
              <Typography variant="subtitle1" gutterBottom>
                Daily Screening Trend
              </Typography>
              <ResponsiveContainer width="100%" height={340}>
                <BarChart data={barData}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="selected" fill="#4caf50" />
                  <Bar dataKey="rejected" fill="#f44336" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
