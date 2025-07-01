"use client";

import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import { useTheme } from "next-themes";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/useGetMountStatus";
import { supabase } from "@/lib/supbase";

interface BestSellerItem {
  quantity: number;
  products: {
    name: string;
  }[];
}


export default function BestSellers() {
  const [dataItems, setDataItems] = useState<BestSellerItem[]>([]);
  const mounted = useGetMountStatus();
  const { theme } = useTheme();

useEffect(() => {
  const fetchBestSellers = async () => {
    const { data, error } = await supabase
      .from("order_items")
      .select("quantity, products(name)")
      .order("quantity", { ascending: false });

    if (error) {
      console.error("Error fetching best sellers:", error.message);
      return;
    }

    const filtered: BestSellerItem[] = (data || [])
      .filter((item): item is BestSellerItem => {
        return (
          Array.isArray(item.products) &&
          item.products.length > 0 &&
          typeof item.products[0]?.name === "string" &&
          item.quantity > 0
        );
      })
      .slice(0, 5);

    setDataItems(filtered);
  };

  fetchBestSellers();
}, []);


  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Best Selling Products
      </Typography>

      <CardContent className="pb-2">
        <div className="relative h-[18.625rem]">
          {mounted && dataItems.length > 0 ? (
            <Pie
              data={{
labels: dataItems.map((item) => item.products[0]?.name || "Unknown"),
                datasets: [
                  {
                    label: "Orders",
                    data: dataItems.map((item) => item.quantity),
                    backgroundColor: [
                      "rgb(34, 197, 94)",
                      "rgb(59, 130, 246)",
                      "rgb(249, 115, 22)",
                      "rgb(99, 102, 241)",
                      "rgb(244, 63, 94)",
                    ],
                    borderColor:
                      theme === "light" ? "rgb(255,255,255)" : "rgb(23,23,23)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                maintainAspectRatio: false,
              }}
            />
          ) : (
            <Skeleton className="size-full" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
