import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { Coupon } from "@/types/coupon"; // Make sure this type exists

// Table columns for actual data
export const columns: ColumnDef<Coupon>[] = [
  {
    header: "Code",
    accessorKey: "code",
  },
  {
    header: "Name",
    accessorKey: "name",
  },
  {
    header: "Discount (%)",
    accessorKey: "discount",
  },
  {
    header: "Created At",
    cell: ({ row }) =>
      format(new Date(row.original.created_at), "dd MMM yyyy"),
  },
];

// Skeleton loading columns
export const skeletonColumns = [
  {
    header: "Code",
    cell: <Skeleton className="w-24 h-6" />,
  },

  {
    header: "Discount (%)",
    cell: <Skeleton className="w-20 h-6" />,
  },
  {
    header: "Created At",
    cell: <Skeleton className="w-24 h-6" />,
  },
];
