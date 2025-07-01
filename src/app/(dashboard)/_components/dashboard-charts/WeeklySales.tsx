"use client";

import { useEffect, useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useTheme } from "next-themes";



import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import useGetMountStatus from "@/hooks/useGetMountStatus";
import { getPastDates } from "@/helpers/getPastDates";
import { supabase } from "@/lib/supbase";

interface Order {
  created_at: string;
  total_amount: number;
}

export default function WeeklySales() {
const labels = useMemo(() => getPastDates(7), []);
  const [salesData, setSalesData] = useState<number[]>([]);
  const [ordersData, setOrdersData] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const mounted = useGetMountStatus();
  const { theme } = useTheme();

  const gridColor = `rgba(161, 161, 170, ${theme === "light" ? "0.5" : "0.3"})`;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const fromDate = new Date();
      fromDate.setDate(fromDate.getDate() - 6); // Last 7 days including today
      const isoDate = fromDate.toISOString();

      const { data, error } = await supabase
        .from("orders")
        .select("created_at, total_amount")
        .gte("created_at", isoDate);

      if (error) {
        console.error("Error fetching orders:", error.message);
        return;
      }

      const grouped: Record<string, { total: number; count: number }> = {};
      for (const label of labels) {
        grouped[label] = { total: 0, count: 0 };
      }

      data?.forEach((order: Order) => {
        const label = new Date(order.created_at).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
        });

        if (grouped[label]) {
          grouped[label].total += Number(order.total_amount ?? 0);
          grouped[label].count += 1;
        }
      });

      setSalesData(labels.map((label) => grouped[label]?.total || 0));
      setOrdersData(labels.map((label) => grouped[label]?.count || 0));
      setLoading(false);
    };

    fetchData();
  }, [labels]);

  return (
    <Card>
      <Typography variant="h3" className="mb-4">
        Weekly Sales
      </Typography>

      <CardContent className="pb-2">
        <Tabs defaultValue="sales">
          <TabsList className="mb-6">
            <TabsTrigger value="sales" className="data-[state=active]:text-primary">
              Sales
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:text-orange-500">
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Sales Chart */}
          <TabsContent value="sales" className="relative h-60">
            {mounted && !loading ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Sales",
                      data: salesData,
                      borderColor: "rgb(34, 197, 94)",
                      backgroundColor: "rgb(34, 197, 94)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      grid: { color: gridColor },
                      border: { color: gridColor },
                      ticks: {
                        padding: 4,
                        callback: function (tickValue: number | string) {
                          return `$${tickValue}`;
                        },
                      },
                    },
                    x: { grid: { display: false } },
                  },
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (context) => `$${context.parsed.y}`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>

          {/* Orders Chart */}
          <TabsContent value="orders" className="relative h-60">
            {mounted && !loading ? (
              <Line
                data={{
                  labels,
                  datasets: [
                    {
                      label: "Orders",
                      data: ordersData,
                      borderColor: "rgb(249, 115, 22)",
                      backgroundColor: "rgb(249, 115, 22)",
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    y: {
                      min: 0,
                      grid: { color: gridColor },
                      border: { color: gridColor },
                      ticks: {
                        padding: 4,
                        stepSize: 1,
                      },
                    },
                    x: { grid: { display: false } },
                  },
                  plugins: {
                    legend: { display: false },
                  },
                }}
              />
            ) : (
              <Skeleton className="size-full" />
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
