import type { ReactNode } from 'react';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, TextField, Stack } from '@mui/material';

type Column<T> = { key: keyof T | string; header: string; render?: (row: T) => ReactNode; width?: number | string };

export type DataTableProps<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  columns: Column<T>[];
  search?: string;
  onSearchChange?: (s: string) => void;
};

export default function DataTable<T extends Record<string, any>>(props: DataTableProps<T>) {
  const { rows, total, page, pageSize, onPageChange, onPageSizeChange, columns, search, onSearchChange } = props;

  return (
    <Paper>
      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        {onSearchChange && (
          <TextField size="small" placeholder="Search…" value={search ?? ''} onChange={(e) => onSearchChange(e.target.value)} />
        )}
      </Stack>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={String(c.key)} style={{ width: c.width }}>{c.header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={i}>
                {columns.map((c) => (
                  <TableCell key={String(c.key)}>
                    {c.render ? c.render(r) : String(r[c.key as keyof T] ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={columns.length} align="center">
                  No data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        page={page}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[10, 25, 50]}
        onPageChange={(_, p) => onPageChange(p)}
        onRowsPerPageChange={(e) => onPageSizeChange(parseInt(e.target.value, 10))}
        count={total}
      />
    </Paper>
  );
}
