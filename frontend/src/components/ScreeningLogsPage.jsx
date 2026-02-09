// src/components/ScreeningLogsPage

// import React, { useEffect, useMemo, useState } from "react";
// import { Box, Divider } from "@mui/material";
// import ScreeningFilterBar from "../components/ScreeningFilterBar";
// import ScreeningResultsTable from "../components/ScreeningResultsTable";
// import ScreeningCharts from "../components/ScreeningCharts";

// export default function ScreeningLogsPage() {
//   const [logs, setLogs] = useState([]);
//   const [filters, setFilters] = useState({
//     startDate: null,
//     endDate: null,
//     client: "",
//     username: "",
//   });

//   useEffect(() => {
//         // fetch("https://yield-gps-share-choosing.trycloudflare.com/logs/screening")
//     fetch("http://localhost:8000/logs/screening")
//       .then((res) => res.json())
//       .then(setLogs)
//       .catch(() => setLogs([]));
//   }, []);

//   // ================= FILTERED LOGS =================
//   const filteredLogs = useMemo(() => {
//     return logs.filter((log) => {
//       const logDate = new Date(log.GeneratedOn);

//       if (filters.startDate && logDate < filters.startDate) return false;
//       if (filters.endDate && logDate > filters.endDate) return false;
//       if (filters.client && log.Client !== filters.client) return false;
//       if (filters.username && log.Username !== filters.username) return false;

//       return true;
//     });
//   }, [logs, filters]);

//   // ================= AGGREGATION FOR TABLE =================
//   const aggregatedRows = useMemo(() => {
//     const map = {};

//     filteredLogs.forEach((log) => {
//       const key = `${log.Username}-${log.Client}`;

//       if (!map[key]) {
//         map[key] = {
//           user: log.Username,
//           account: log.Client || "-",
//           profiles: 0,
//           rejected: 0,
//           selected: 0,
//         };
//       }

//       map[key].profiles += log.TotalProfiles || 0;
//       map[key].rejected += log.RejectedCount || 0;
//       map[key].selected += log.Count || 0;
//     });

//     return Object.values(map);
//   }, [filteredLogs]);

//   return (
//     <Box>
//       {/* ===== FILTER HEADER ===== */}
//       <ScreeningFilterBar
//         logs={logs}
//         filters={filters}
//         onChange={setFilters}
//       />

//       {/* ===== CHARTS (FILTERED) ===== */}
//       <ScreeningCharts logs={filteredLogs} />

//       <Divider sx={{ my: 2 }} />

//       {/* ===== RESULTS TABLE ===== */}
//       <ScreeningResultsTable rows={aggregatedRows} />
//     </Box>
//   );
// }


// src/components/ScreeningLogsPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Box, Divider } from "@mui/material";
import ScreeningFilterBar from "../components/ScreeningFilterBar";
import ScreeningResultsTable from "../components/ScreeningResultsTable";
import ScreeningCharts from "../components/ScreeningCharts";

/* ================= HELPER: QUARTER START ================= */
const getQuarterStart = (date = new Date()) => {
  const month = date.getMonth(); // 0-11
  const quarterStartMonth = Math.floor(month / 3) * 3;
  return new Date(date.getFullYear(), quarterStartMonth, 1);
};

export default function ScreeningLogsPage() {
  const loggedInUser = localStorage.getItem("username") || "";

  /* ================= STATE ================= */
  const [logs, setLogs] = useState([]);
  const [filters, setFilters] = useState({
    startDate: getQuarterStart(), // ✅ Quarter start
    endDate: new Date(),          // ✅ Today
    client: "",                   // ✅ ALL
    username: loggedInUser,       // ✅ My username
  });

  /* ================= FETCH LOGS ================= */
  useEffect(() => {
    // fetch("http://localhost:8000/logs/screening")
        fetch("https://yield-gps-share-choosing.trycloudflare.com/logs/screening")
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

  return (
    <Box>
      {/* ===== FILTER HEADER ===== */}
      <ScreeningFilterBar
        logs={logs}
        filters={filters}
        onChange={setFilters}
      />

      {/* ===== DONUT CHARTS (FILTERED) ===== */}
      <ScreeningCharts logs={filteredLogs} />

      <Divider sx={{ my: 2 }} />

      {/* ===== RESULTS TABLE ===== */}
      <ScreeningResultsTable rows={aggregatedRows} />
    </Box>
  );
}
