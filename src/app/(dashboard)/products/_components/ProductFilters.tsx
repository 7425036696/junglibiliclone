"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProductsTable from "./products-table/Table";
import { columns, skeletonColumns } from "./products-table/columns";
import TableSkeleton from "@/components/shared/TableSkeleton";
import TableError from "@/components/shared/TableError";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

import EditProduct from "./EditProduct";
import { fetchProducts } from "@/data/products";

export default function ProductFilters() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: products,
    isLoading,
    isError: productError,
    refetch,
  } = useQuery({
    queryKey: ["products", search, sort],
    queryFn: () => fetchProducts({ search, sort }),
  });

  const handleReset = () => {
    setSearch("");
    setSort("");
    refetch();
  };

  const handleExport = () => {
    if (!products?.data?.length) return;

    const headers = Object.keys(products.data[0]).join(",");
    const rows = products.data
      .map((product) =>
        Object.values(product)
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
    a.download = "products-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Card className="mb-5 p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            refetch();
          }}
          className="flex flex-col lg:flex-row lg:items-center gap-4"
        >
          {/* Filters & Actions in One Row */}
          <Input
            type="search"
            placeholder="Search product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-10 w-full lg:w-1/4"
          />

          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-full lg:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
              <SelectItem value="date-added-asc">Date Added (Asc)</SelectItem>
              <SelectItem value="date-added-desc">Date Added (Desc)</SelectItem>
            </SelectContent>
          </Select>

         

          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="h-10"
            onClick={handleReset}
          >
            Reset
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-10"
            onClick={handleExport}
          >
            Export
          </Button>

          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button size="sm" className="h-10">
                <Plus className="mr-2 size-4" />
                Add Product
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col p-0">
              <EditProduct
                onSave={() => {
                  queryClient.invalidateQueries({ queryKey: ["products"] });
                  setSheetOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>
        </form>
      </Card>

      {/* Products Table */}
      {isLoading ? (
        <TableSkeleton perPage={10} columns={skeletonColumns} />
      ) : productError || !products ? (
        <TableError
          errorMessage="Something went wrong while fetching products"
          refetch={refetch}
        />
      ) : (
        <ProductsTable
          columns={columns}
          data={products.data}
          pagination={{
            page: 1,
            pages: 1,
            perPage: 10,
            current: 1,
            total: products.total,
          }}
        />
      )}
    </>
  );
}
