import React from "react";
import {
  Box,
  TextField,
  MenuItem,
} from "@mui/material";

export default function ScreeningFilterBar({ logs, filters, onChange }) {
  const clients = [...new Set(logs.map((l) => l.Client).filter(Boolean))];
  const users = [...new Set(logs.map((l) => l.Username))];

  return (
    <Box
      display="flex"
      gap={2}
      mb={2}
      flexWrap="wrap"
      alignItems="center"
    >
      <TextField
        type="date"
        label="Start Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) =>
          onChange({ ...filters, startDate: new Date(e.target.value) })
        }
      />

      <TextField
        type="date"
        label="End Date"
        InputLabelProps={{ shrink: true }}
        onChange={(e) =>
          onChange({ ...filters, endDate: new Date(e.target.value) })
        }
      />

      <TextField
        select
        label="Account"
        value={filters.client}
        sx={{ minWidth: 180 }}
        onChange={(e) =>
          onChange({ ...filters, client: e.target.value })
        }
      >
        <MenuItem value="">All</MenuItem>
        {clients.map((c) => (
          <MenuItem key={c} value={c}>
            {c}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        label="User"
        value={filters.username}
        sx={{ minWidth: 220 }}
        onChange={(e) =>
          onChange({ ...filters, username: e.target.value })
        }
      >
        <MenuItem value="">All</MenuItem>
        {users.map((u) => (
          <MenuItem key={u} value={u}>
            {u}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  );
}
