"use client";
import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import DataTable from "@/components/shared/DataTable";
import { Order } from "@/data/orders";
import { ColumnDef } from "@tanstack/react-table";
import { PaginationProps } from "@/types/pagination";

type Props = {
  data: Order[];
  pagination: PaginationProps;
  columns: ColumnDef<Order>[];
};

export default function OrdersTable({ data, pagination, columns }: Props) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(), // ✅ Fix was here
  });

  return <DataTable table={table} pagination={pagination} />;
}
