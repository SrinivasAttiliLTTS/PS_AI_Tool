// // src/components/ScreeningCharts.jsx
// import React from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#f44336"];

// export default function ScreeningCharts({ logs }) {
//   if (!logs || logs.length === 0) {
//     return (
//       <Typography align="center" color="text.secondary">
//         No screening data available
//       </Typography>
//     );
//   }

//   // ----------------------------
//   // KPI CALCULATIONS
//   // ----------------------------
// const totalProfiles = logs.reduce((s, l) => s + l.TotalProfiles, 0);
// const selectedProfiles = logs.reduce((s, l) => s + (l.Count || 0), 0);
// const rejectedProfiles = logs.reduce((s, l) => s + (l.RejectedCount || 0), 0);

//   const totalRuns = logs.length;
// //   const totalProfiles = logs.reduce((s, l) => s + l.Count, 0);
// //   const selectedProfiles = logs
// //   .filter(l => l.Selected)
// //   .reduce((s, l) => s + l.Count, 0);
// //   const rejectedProfiles = totalProfiles - selectedProfiles;

// //   const totalRuns = logs.length;
// //   const totalSelected = logs.reduce((s, l) => s + l.Count, 0);
// //   const totalRejected = logs.reduce(
// //     (s, l) => s + (l.Selected ? 0 : 1),
// //     0
// //   );

//   // ----------------------------
//   // PIE DATA
//   // ----------------------------
//   const groupBy = (key) => {
//     const map = {};
//     logs.forEach((l) => {
//       const k = l[key] || "Unknown";
//       map[k] = (map[k] || 0) + 1;
//     });
//     return Object.entries(map).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   };

//   const clientData = groupBy("Client");
//   const roleData = groupBy("Role");

//   // ----------------------------
//   // BAR DATA
//   // ----------------------------
//   const dateMap = {};

// logs.forEach((l) => {
//   const d = new Date(l.GeneratedOn).toLocaleDateString();
  
//   if (!dateMap[d]) {
//     dateMap[d] = { date: d, selected: 0, rejected: 0 };
//   }

//   // Add counts from JSON
//   dateMap[d].selected += l.Count || 0;         // Selected profiles
//   dateMap[d].rejected += l.RejectedCount || 0; // Rejected profiles
// });

// const barData = Object.values(dateMap);

// //   const dateMap = {};
// //   logs.forEach((l) => {
// //     const d = new Date(l.GeneratedOn).toLocaleDateString();
// //     if (!dateMap[d]) dateMap[d] = { date: d, selected: 0, rejected: 0 };
// //     l.Selected ? dateMap[d].selected++ : dateMap[d].rejected++;
// //   });

// //   const barData = Object.values(dateMap);

//   // ----------------------------
//   // UI
//   // ----------------------------
//   return (
//     <Box sx={{ p: 2 }}>
//       {/* ================= KPI ROW ================= */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {[
//   { label: "Screening Runs", value: totalRuns },
//   { label: "Profiles Screened", value: totalProfiles },
//   { label: "Profiles Selected", value: selectedProfiles },
//   { label: "Profiles Rejected", value: rejectedProfiles },
// ].map((kpi, i) => (
//   <Grid item xs={12} md={3} key={i}>
//     <Card sx={{ textAlign: "center" }}>
//       <CardContent>
//         <Typography variant="h4" fontWeight={600}>
//           {kpi.value}
//         </Typography>
//         <Typography color="text.secondary">
//           {kpi.label}
//         </Typography>
//       </CardContent>
//     </Card>
//   </Grid>
// ))}

//       </Grid>

//       {/* ================= PIE CHARTS ================= */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {/* Client */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: 360 }}>
//             <CardContent>
//               <Typography variant="subtitle1" gutterBottom>
//                 Screening by Client
//               </Typography>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie data={clientData} dataKey="value" label>
//                     {clientData.map((_, i) => (
//                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Role */}
//         <Grid item xs={12} md={6}>
//           <Card sx={{ height: 360 }}>
//             <CardContent>
//               <Typography variant="subtitle1" gutterBottom>
//                 Screening by Role
//               </Typography>
//               <ResponsiveContainer width="100%" height={280}>
//                 <PieChart>
//                   <Pie data={roleData} dataKey="value" label>
//                     {roleData.map((_, i) => (
//                       <Cell key={i} fill={COLORS[i % COLORS.length]} />
//                     ))}
//                   </Pie>
//                   <Tooltip />
//                 </PieChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>

//       {/* ================= BAR CHART ================= */}
//       <Grid container>
//         <Grid item xs={12}>
//           <Card sx={{ height: 420 }}>
//             <CardContent>
//               <Typography variant="subtitle1" gutterBottom>
//                 Daily Screening Trend
//               </Typography>
//               <ResponsiveContainer width="100%" height={340}>
//                 <BarChart data={barData}>
//                   <XAxis dataKey="date" />
//                   <YAxis />
//                   <Tooltip />
//                   <Legend />
//                   <Bar dataKey="selected" fill="#4caf50" />
//                   <Bar dataKey="rejected" fill="#f44336" />
//                 </BarChart>
//               </ResponsiveContainer>
//             </CardContent>
//           </Card>
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }

// // src/components/ScreeningCharts.jsx
// import React from "react";
// import {
//   Grid,
//   Card,
//   CardContent,
//   Typography,
//   Box,
// } from "@mui/material";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from "recharts";

// const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#f44336"];

// export default function ScreeningCharts({ logs }) {
//   if (!logs || logs.length === 0) {
//     return (
//       <Typography align="center" color="text.secondary">
//         No screening data available
//       </Typography>
//     );
//   }

//   // ================= KPI CALCULATIONS =================
//   const totalProfiles = logs.reduce((s, l) => s + (l.TotalProfiles || 0), 0);
//   const selectedProfiles = logs.reduce((s, l) => s + (l.Count || 0), 0);
//   const rejectedProfiles = logs.reduce(
//     (s, l) => s + (l.RejectedCount || 0),
//     0
//   );
//   const totalRuns = logs.length;

//   // ================= PIE DATA =================
//   const groupBy = (key) => {
//     const map = {};
//     logs.forEach((l) => {
//       const k = l[key] || "Unknown";
//       map[k] = (map[k] || 0) + 1;
//     });
//     return Object.entries(map).map(([name, value]) => ({
//       name,
//       value,
//     }));
//   };

//   const clientData = groupBy("Client");
//   const roleData = groupBy("Role");
//   const userData = groupBy("Username"); // ✅ NEW

//   // ================= BAR DATA =================
//   const dateMap = {};
//   logs.forEach((l) => {
//     const d = new Date(l.GeneratedOn).toLocaleDateString();
//     if (!dateMap[d]) {
//       dateMap[d] = { date: d, selected: 0, rejected: 0 };
//     }
//     dateMap[d].selected += l.Count || 0;
//     dateMap[d].rejected += l.RejectedCount || 0;
//   });

//   // const barData = Object.values(dateMap);
// const barData = Object.values(dateMap).map(d => {
//   const total = d.selected + d.rejected;
//   return {
//     ...d,
//     total,
//     selectedPct: total ? Math.round((d.selected / total) * 100) : 0,
//   };
// });

//   // ================= UI =================
//   return (
//     <Box sx={{ p: 1 }}>
//       {/* ================= KPI ROW ================= */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {[
//           { label: "Screening Runs", value: totalRuns },
//           { label: "Profiles Screened", value: totalProfiles },
//           { label: "Profiles Selected", value: selectedProfiles },
//           { label: "Profiles Rejected", value: rejectedProfiles },
//         ].map((kpi, i) => (
//           <Grid item xs={12} sm={6} md={3} key={i}>
//             <Card sx={{ textAlign: "center" }}>
//               <CardContent>
//                 <Typography variant="h5" fontWeight={600}>
//                   {kpi.value}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {kpi.label}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* ================= PIE CHARTS (COMPACT) ================= */}
//       <Grid container spacing={2} sx={{ mb: 2 }}>
//         {[
//           { title: "By Client", data: clientData },
//           { title: "By Role", data: roleData },
//           { title: "By User", data: userData }, // ✅ NEW
//         ].map((item, idx) => (
//           <Grid item xs={12} md={4} key={idx}>
//             <Card sx={{ height: 300 }}>
//               <CardContent>
//                 <Typography
//                   variant="subtitle2"
//                   gutterBottom
//                   textAlign="center"
//                 >
//                   Screening {item.title}
//                 </Typography>

//                 <ResponsiveContainer width="100%" height={220}>
//                   <PieChart>
//                     <Pie
//                       data={item.data}
//                       dataKey="value"
//                       nameKey="name"
//                       innerRadius={45}
//                       outerRadius={75}
//                       paddingAngle={3}
//                     >
//                       {item.data.map((_, i) => (
//                         <Cell
//                           key={i}
//                           fill={COLORS[i % COLORS.length]}
//                         />
//                       ))}
//                     </Pie>
//                     <Tooltip />
//                     <Legend
//                       layout="horizontal"
//                       verticalAlign="bottom"
//                       height={36}
//                     />
//                   </PieChart>
//                 </ResponsiveContainer>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       {/* ================= BAR CHART ================= */}
//       {/* ================= ADVANCED BAR CHART ================= */}
// <Grid container>
//   <Grid item xs={12}>
//     <Card sx={{ height: 380 }}>
//       <CardContent>
//         <Typography variant="subtitle1" gutterBottom>
//           Daily Screening Outcome
//         </Typography>

//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart
//             data={barData}
//             barCategoryGap={12}
//             barGap={2}
//           >
//             <XAxis dataKey="date" />
//             <YAxis />
//             <Tooltip
//               formatter={(value, name, props) => {
//                 if (name === "selected") {
//                   return [
//                     `${value} (${props.payload.selectedPct}%)`,
//                     "Selected",
//                   ];
//                 }
//                 return [value, "Rejected"];
//               }}
//             />
//             <Legend />

//             <Bar
//               dataKey="selected"
//               stackId="a"
//               radius={[6, 6, 0, 0]}
//               fill="#1976d2"   // calm blue
//               name="Selected"
//             />

//             <Bar
//               dataKey="rejected"
//               stackId="a"
//               radius={[6, 6, 0, 0]}
//               fill="#b0bec5"   // neutral grey
//               name="Rejected"
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </CardContent>
//     </Card>
//   </Grid>
// </Grid>

//     </Box>
//   );
// }

// src/components/ScreeningCharts.jsx
import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Stack,
  LinearProgress,
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
import { Line, ReferenceLine } from "recharts"; // make sure Line is imported

export default function ScreeningCharts({ logs }) {
  if (!logs || logs.length === 0) {
    return (
      <Typography align="center" color="text.secondary">
        No screening data available
      </Typography>
    );
  }
const COLORS = ["#1976d2", "#9c27b0", "#ff9800", "#4caf50", "#f44336"];

  // ================= KPI =================
  const totalProfiles = logs.reduce((s, l) => s + (l.TotalProfiles || 0), 0);
  const selected = logs.reduce((s, l) => s + (l.Count || 0), 0);
  const rejected = logs.reduce((s, l) => s + (l.RejectedCount || 0), 0);
  const runs = logs.length;
  const successPct = totalProfiles
    ? Math.round((selected / totalProfiles) * 100)
    : 0;

  // ================= TREND =================
  const dateMap = {};
  logs.forEach((l) => {
    const d = new Date(l.GeneratedOn).toLocaleDateString();
    if (!dateMap[d]) dateMap[d] = { date: d, selected: 0, rejected: 0 };
    dateMap[d].selected += l.Count || 0;
    dateMap[d].rejected += l.RejectedCount || 0;
  });

  //   // ================= PIE DATA =================
  const groupBy1 = (key) => {
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

  const clientData = groupBy1("Client");
  const roleData = groupBy1("Role");
  const userData = groupBy1("Username"); // ✅ NEW

//   const barData = Object.values(dateMap).map((d) => {
//   const total = d.selected + d.rejected;
//   return {
//     ...d,
//     total,
//     selectedPct: total ? Math.round((d.selected / total) * 100) : 0, // 0-100
//   };
// });

  const barData = Object.values(dateMap);

  // ================= DISTRIBUTION =================
  const groupBy = (key) => {
    const map = {};
    logs.forEach((l) => {
      const k = l[key] || "Unknown";
      map[k] = (map[k] || 0) + 1;
    });
    return Object.entries(map)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const dist = [
    { title: "Top Clients", data: groupBy("Client") },
    { title: "Top Roles", data: groupBy("Role") },
    { title: "Top Users", data: groupBy("Username") },
  ];

  return (
    <Box sx={{ p: 2 }}>
      {/* ================= KPI STRIP ================= */}
      <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
        {[
          { label: "Runs", value: runs },
          { label: "Screened", value: totalProfiles },
          { label: "Selected", value: selected },
          { label: "Rejected", value: rejected },
          { label: "Success %", value: `${successPct}%` },
        ].map((k, i) => (
          <Card key={i} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="h6">{k.value}</Typography>
              <Typography variant="caption" color="text.secondary">
                {k.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* ================= PIE CHARTS (COMPACT) ================= */}
       <Grid container spacing={2} sx={{ mb: 2 }}>
         {[
          { title: "By Client", data: clientData },
          { title: "By Role", data: roleData },
          { title: "By User", data: userData }, // ✅ NEW
        ].map((item, idx) => (
          <Grid item xs={12} md={4} key={idx}>
            <Card sx={{ height: 300 }}>
              <CardContent>
                <Typography
                  variant="subtitle2"
                  gutterBottom
                  textAlign="center"
                >
                  Screening {item.title}
                </Typography>

                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={item.data}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={3}
                    >
                      {item.data.map((_, i) => (
                        <Cell
                          key={i}
                          fill={COLORS[i % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      layout="horizontal"
                      verticalAlign="bottom"
                      height={36}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ================= TREND ================= */}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="subtitle1" gutterBottom>
            Screening Trend
          </Typography>

<ResponsiveContainer width="100%" height={300}>
  <BarChart
    data={barData.sort((a, b) => new Date(a.date) - new Date(b.date))}
    margin={{ top: 20, right: 40, left: 0, bottom: 0 }}
  >
    <XAxis dataKey="date" />

    {/* Primary axis: counts */}
    <YAxis yAxisId="left" />

    {/* Secondary axis: success % */}
    <YAxis
      yAxisId="right"
      orientation="right"
      domain={[0, 100]} // important for line visibility
      tickFormatter={(v) => `${v}%`}
    />

    <Tooltip
      formatter={(value, name, props) => {
        if (name === "selected") {
          return [`${value} (${props.payload.selectedPct}%)`, "Selected"];
        }
        return [value, name === "rejected" ? "Rejected" : name];
      }}
    />

    <Legend />

    {/* Bars */}
    <Bar
      yAxisId="left"
      dataKey="selected"
      stackId="a"
      fill="#1976d2"
      name="Selected"
      radius={[6, 6, 0, 0]}
    />
    <Bar
      yAxisId="left"
      dataKey="rejected"
      stackId="a"
      fill="#cfd8dc"
      name="Rejected"
      radius={[6, 6, 0, 0]}
    />

    {/* Success % line */}
    <Line
      yAxisId="right" // MUST match secondary axis
      type="monotone"
      dataKey="selectedPct"
      stroke="#2e7d32" // green
      strokeWidth={2}
      dot={{ r: 3, fill: "#2e7d32" }}
      name="Success %"
    />

    {/* Reference Line */}
    <ReferenceLine
      yAxisId="right"
      y={70} // target %
      stroke="#ff5252"
      strokeDasharray="4 4"
      label={{ value: "Target 70%", position: "top", fill: "#ff5252" }}
    />
  </BarChart>
</ResponsiveContainer>

        </CardContent>
      </Card>

      {/* ================= DISTRIBUTION ================= */}
      <Grid container spacing={2}>
        {dist.map((section, i) => (
          <Grid item xs={12} md={4} key={i}>
            <Card>
              <CardContent>
                <Typography variant="subtitle2" gutterBottom>
                  {section.title}
                </Typography>
                {section.data.map((d, idx) => (
                  <Box key={idx} sx={{ mb: 1 }}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                    >
                      <Typography variant="caption">{d.name}</Typography>
                      <Typography variant="caption">{d.value}</Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={(d.value / section.data[0].value) * 100}
                    />
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
