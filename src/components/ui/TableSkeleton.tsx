import { TableCell, TableRow } from "@/components/ui/table";

interface TableSkeletonProps {
  columns: number;
  rows?: number;
}

/** Skeleton loading row for data table — used inside <TableBody>. */
const TableSkeleton = ({ columns, rows = 5 }: TableSkeletonProps) => (
  <>
    {Array.from({ length: rows }, (_, r) => (
      <TableRow key={r} className="hover:bg-transparent">
        {Array.from({ length: columns }, (_, c) => (
          <TableCell key={c}>
            <div
              className="h-4 rounded-md bg-muted animate-pulse"
              style={{ width: `${55 + ((r * columns + c) * 17) % 40}%`, animationDelay: `${(r * columns + c) * 60}ms` }}
            />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
);

export default TableSkeleton;
