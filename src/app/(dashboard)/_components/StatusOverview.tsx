"use client";

import { useEffect, useState } from "react";
import {
  HiOutlineShoppingCart,
  HiOutlineRefresh,
  HiOutlineCheck,
} from "react-icons/hi";
import { BsTruck } from "react-icons/bs";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import Typography from "@/components/ui/typography";
import { DashboardCard } from "@/types/card";
import { supabase } from "@/lib/supbase";

export default function StatusOverview() {
  const [orderCounts, setOrderCounts] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0,
  });

  useEffect(() => {
    const fetchOrderCounts = async () => {
      const [{ count: total }, { count: pending }, { count: processing }, { count: delivered }] =
        await Promise.all([
          supabase.from("orders").select("*", { count: "exact", head: true }),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "processing"),
          supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
        ]);

      setOrderCounts({
        total: total ?? 0,
        pending: pending ?? 0,
        processing: processing ?? 0,
        delivered: delivered ?? 0,
      });
    };

    fetchOrderCounts();
  }, []);

  const cards: DashboardCard[] = [
    {
      icon: <HiOutlineShoppingCart />,
      title: "Total Orders",
      value: orderCounts.total.toString(),
      className:
        "text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "Orders Pending",
      value: orderCounts.pending.toString(),
      className:
        "text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500",
    },
    {
      icon: <BsTruck />,
      title: "Orders Processing",
      value: orderCounts.processing.toString(),
      className:
        "text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500",
    },
    {
      icon: <HiOutlineCheck />,
      title: "Orders Delivered",
      value: orderCounts.delivered.toString(),
      className:
        "text-emerald-600 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-500",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardContent className="flex items-center gap-3 p-0">
            <div
              className={cn(
                "size-12 rounded-full grid place-items-center [&>svg]:size-5",
                card.className
              )}
            >
              {card.icon}
            </div>

            <div className="flex flex-col gap-y-1">
              <Typography className="text-sm text-muted-foreground">
                {card.title}
              </Typography>

              <Typography className="text-2xl font-semibold text-popover-foreground">
                {card.value}
              </Typography>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
