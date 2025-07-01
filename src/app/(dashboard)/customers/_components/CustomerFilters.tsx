"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import CustomersTable from "./customers-table/Table";
import { columns, skeletonColumns } from "./customers-table/columns";
import { fetchCustomers } from "@/data/customers"; // YOU MUST IMPLEMENT THIS

export default function CustomerFilters() {
  const [search, setSearch] = useState("");

  const {
    data: customers,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["customers", search],
    queryFn: () => fetchCustomers({ search }), // implement search on email/name/phone
  });

  const handleReset = () => {
    setSearch("");
    refetch();
  };

  const handleExport = () => {
    if (!customers?.data?.length) return;

    const headers = Object.keys(customers.data[0]).join(",");
    const rows = customers.data
      .map((cust) =>
        Object.values(cust)
          .map((val) => `"${String(val).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${rows}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      {/* Filter Bar */}
      <Card className="mb-5">
        <form
          className="flex flex-col md:flex-row gap-4 lg:gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
        >
          <Input
            type="search"
            placeholder="Search by name, phone or email"
            className="h-12 md:basis-1/2"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
           
            <Button
              size="lg"
              variant="secondary"
              className="flex-grow"
              type="button"
              onClick={handleReset}
            >
              Reset
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="flex-grow"
              type="button"
              onClick={handleExport}
            >
              Export
            </Button>
          </div>
        </form>
      </Card>

      {/* Table Display */}
      {isLoading ? (
        <TableSkeleton perPage={10} columns={skeletonColumns} />
      ) : isError || !customers ? (
        <TableError
          errorMessage="Something went wrong while fetching customers"
          refetch={refetch}
        />
      ) : (
        <CustomersTable
          columns={columns}
          data={customers.data}
          pagination={{
            page: 1,
            pages: 1,
            perPage: 10,
            current: 1,
            total: customers.total,
          }}
        />
      )}
    </>
  );
}
