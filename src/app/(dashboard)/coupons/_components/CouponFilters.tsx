"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";

import { columns, skeletonColumns } from "./coupons-table/columns";
import CouponsTable from "./coupons-table/Table";
import { fetchCoupons } from "@/data/coupons";
import EditCoupon from "./EditCoupon"; // make sure this exists

export default function CouponFilters() {
  const [search, setSearch] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: coupons,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["coupons", search],
    queryFn: () => fetchCoupons({ search }),
  });

  const handleReset = () => {
    setSearch("");
    refetch();
  };

  const handleExport = () => {
    if (!coupons?.data?.length) return;

    const headers = Object.keys(coupons.data[0]).join(",");
    const rows = coupons.data
      .map((c) =>
        Object.values(c)
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`${headers}\n${rows}`], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "coupons-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="mb-5">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col md:flex-row gap-4 lg:gap-6">
            <Input
              type="search"
              placeholder="Search by coupon code or name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-12 md:basis-1/2"
            />

            <div className="flex flex-wrap sm:flex-nowrap gap-4 md:basis-1/2">
            
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleReset}
                className="flex-grow"
              >
                Reset
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={handleExport}
                className="flex-grow"
              >
                Export
              </Button>
              <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetTrigger asChild>
                  <Button size="lg" className="flex-grow">
                    <Plus className="mr-2 size-4" /> Add Coupon
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col p-0">
                  <EditCoupon
                    onSave={() => {
                      queryClient.invalidateQueries({ queryKey: ["coupons"] });
                      setSheetOpen(false);
                    }}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </form>
      </Card>

      {isLoading ? (
        <TableSkeleton perPage={10} columns={skeletonColumns} />
      ) : isError || !coupons ? (
        <TableError
          errorMessage="Something went wrong while fetching coupons"
          refetch={refetch}
        />
      ) : (
        <CouponsTable
          columns={columns}
          data={coupons.data}
          pagination={{
            page: 1,
            pages: 1,
            perPage: 10,
            current: 1,
            total: coupons.total,
          }}
        />
      )}
    </>
  );
}
