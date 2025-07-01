"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

import OrdersTable from "./orders-table/Table";
import DatePickerWithRange from "./data-range-picker";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";

import { fetchOrders } from "@/data/orders";
import { columns, skeletonColumns } from "./orders-table/columns";

export default function OrderFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [limit, setLimit] = useState(""); // 7, 14, 30
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  const {
    data: orders,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["orders", search, status, paymentMethod, limit, dateRange],
    queryFn: () =>
      fetchOrders({
        search,
        status,
        paymentMethod,
        limit,
        startDate: dateRange.from?.toISOString(),
        endDate: dateRange.to?.toISOString(),
      }),
  });

  const handleReset = () => {
    setSearch("");
    setStatus("");
    setPaymentMethod("");
    setLimit("");
    setDateRange({});
    refetch();
  };

  const handleExport = () => {
    if (!orders?.data?.length) return;

    const headers = Object.keys(orders.data[0]).join(",");
    const rows = orders.data
      .map((order) =>
        Object.values(order)
          .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${rows}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="mb-5 p-4 space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
          className="flex flex-col md:flex-row gap-4 flex-wrap"
        >
          {/* Search input */}
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name..."
            className="md:basis-[20%]"
          />

          {/* Order status dropdown */}
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="md:basis-[20%]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          {/* Payment method dropdown */}
          <Select value={paymentMethod} onValueChange={setPaymentMethod}>
            <SelectTrigger className="md:basis-[20%]">
              <SelectValue placeholder="Payment Method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cod">Cash on Delivery</SelectItem>
              <SelectItem value="card">Card</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="paypal">PayPal</SelectItem>
            </SelectContent>
          </Select>

          {/* Limit filter dropdown */}
          <Select value={limit} onValueChange={setLimit}>
            <SelectTrigger className="md:basis-[20%]">
              <SelectValue placeholder="Limit (days)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7">Last 7 Days</SelectItem>
              <SelectItem value="14">Last 14 Days</SelectItem>
              <SelectItem value="30">Last 30 Days</SelectItem>
            </SelectContent>
          </Select>

          {/* Date range */}
          <DatePickerWithRange date={dateRange} setDate={setDateRange} />

          {/* Actions */}
          <div className="flex flex-wrap gap-2 md:basis-full">
            <Button type="submit">Filter</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Reset
            </Button>
            <Button type="button" variant="outline" onClick={handleExport}>
              Download CSV
            </Button>
          </div>
        </form>
      </Card>

      {/* Table display */}
      {isLoading ? (
        <TableSkeleton perPage={10} columns={skeletonColumns} />
      ) : isError || !orders ? (
        <TableError errorMessage="Failed to fetch orders" refetch={refetch} />
      ) : (
        <OrdersTable
          data={orders.data}
          pagination={orders.pagination}
          columns={columns}
        />
      )}
    </>
  );
}
