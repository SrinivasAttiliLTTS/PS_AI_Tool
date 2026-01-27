// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   IconButton,
//   Typography,
//   Box,
//   Chip,
//   Divider,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import ScreeningCharts from "./ScreeningCharts";

// export default function ScreeningHistory({ open, onClose }) {
//   const [logs, setLogs] = useState([]);

//   useEffect(() => {
//     if (!open) return;

//     console.log("📡 Fetching screening logs...");
//     fetch("http://localhost:8000/logs/screening")
//           // fetch("https://presents-smilies-starts-cooper.trycloudflare.com/logs/screening")
//     // fetch("https://ps-ai-tool-mk0p.onrender.com/logs/screening")
//       .then((res) => {
//         console.log("✅ Response status:", res.status);
//         return res.json();
//       })
//       .then((data) => {
//         console.log("📄 Screening logs response:", data);
//         setLogs(Array.isArray(data) ? data : []);
//       })
//       .catch((err) => {
//         console.error("❌ Failed to load logs", err);
//         setLogs([]);
//       });
//   }, [open]);

//   // helper to flatten KeySkill array
//   const flattenSkills = (skills) =>
//     skills.flatMap((s) => (Array.isArray(s) ? s : s));

//   return (
//     <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
//       <DialogTitle>
//         Screening History
//         <IconButton
//           onClick={onClose}
//           sx={{ position: "absolute", right: 8, top: 8 }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         {logs.length === 0 ? (
//           <Typography>No screening logs available</Typography>
//         ) : (
//           <>
//             {logs.map((log, idx) => (
//               <Box key={idx} sx={{ mb: 2 }}>
//                 <Typography variant="subtitle2">
//                   {new Date(log.GeneratedOn).toLocaleString()}
//                 </Typography>

//                 <Typography variant="body2">
//                   <b>Client:</b> {log.Client || "-"} | <b>Role:</b>{" "}
//                   {log.Role || "-"}
//                 </Typography>

//                 <Box sx={{ my: 1 }}>
//                   {flattenSkills(log.KeySkill || []).map((s, i) => (
//                     <Chip
//                       key={i}
//                       label={s}
//                       size="small"
//                       sx={{ mr: 0.5, mb: 0.5 }}
//                     />
//                   ))}
//                 </Box>

//                 <Typography variant="body2">
//                   <b>Selected Profiles:</b>{" "}
//                   {(log["Selected Profiles"] || []).join(", ")}
//                 </Typography>

//                 <Typography variant="body2">
//                   <b>Rejected Profiles:</b>{" "}
//                   {(log["Rejected Profiles"] || []).join(", ")}
//                 </Typography>

//                 <Typography variant="body2">
//                   <b>Count:</b> {log.Count} | <b>Rejected Count:</b>{" "}
//                   {log.RejectedCount}
//                 </Typography>

//                 <Divider sx={{ mt: 2 }} />
//               </Box>
//             ))}

//             {/* Render charts once */}
//             <ScreeningCharts logs={logs} />
//           </>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ScreeningLogsPage from "./ScreeningLogsPage";

export default function ScreeningHistory({ open, onClose }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
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
        <ScreeningLogsPage />
      </DialogContent>
    </Dialog>
  );
}

