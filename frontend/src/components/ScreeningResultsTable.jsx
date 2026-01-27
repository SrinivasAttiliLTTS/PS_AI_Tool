import React from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";

export default function ScreeningResultsTable({ rows }) {
  if (rows.length === 0) {
    return <Typography>No results found</Typography>;
  }

  return (
    <Table size="small">
      <TableHead>
        <TableRow>
          <TableCell>Users</TableCell>
          <TableCell>Accounts</TableCell>
          <TableCell>Profiles</TableCell>
          <TableCell>Rejected</TableCell>
          <TableCell>Selected</TableCell>
        </TableRow>
      </TableHead>

      <TableBody>
        {rows.map((row, idx) => (
          <TableRow key={idx}>
            <TableCell>{row.user}</TableCell>
            <TableCell>{row.account}</TableCell>
            <TableCell>{row.profiles}</TableCell>
            <TableCell>{row.rejected}</TableCell>
            <TableCell>{row.selected}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
