import { ColumnDef } from "@tanstack/react-table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supbase"; // fix spelling
import { Order } from "@/types/order";

export const columns: ColumnDef<Order>[] = [
  {
    header: "Order ID",
    accessorKey: "id",
    cell: ({ row }) => `#${String(row.original.id).padStart(6, "0")}`,
  },
  {
    header: "Customer",
    accessorKey: "shipping_address",
    cell: ({ row }) => row.original.shipping_address?.name || "—",
  },
  {
    header: "Status",
    accessorKey: "status",
    cell: ({ row }) => {
      const order = row.original;

      const handleStatusChange = async (newStatus: string) => {
        const { error } = await supabase
          .from("orders")
          .update({ status: newStatus })
          .eq("id", order.id);

        if (error) {
          toast.error("Failed to update status");
        } else {
          toast.success("Status updated");
        }
      };

      return (
        <Select value={order.status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[120px] text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      );
    },
  },
  {
    header: "Payment",
    accessorKey: "payment_method",
    cell: ({ row }) => row.original.payment_method,
  },
  {
    header: "Amount",
    accessorKey: "total_amount",
    cell: ({ row }) => `₹${row.original.total_amount}`,
  },
  {
    header: "Date",
    accessorKey: "created_at",
    cell: ({ row }) =>
      new Date(row.original.created_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
  },
];

// skeletonColumns for loading state
export const skeletonColumns: ColumnDef<Order>[] = columns;
