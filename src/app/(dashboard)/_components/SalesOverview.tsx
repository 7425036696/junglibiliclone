"use client";

import { useEffect, useState } from "react";
import { HiOutlineRefresh } from "react-icons/hi";
import {
  HiOutlineSquare3Stack3D,
  HiCalendarDays,
} from "react-icons/hi2";

import { cn } from "@/lib/utils";
import Typography from "@/components/ui/typography";
import { DashboardCard } from "@/types/card";
import { supabase } from "@/lib/supbase";


export default function SalesOverview() {
  const [data, setData] = useState({
    today: 0,
    yesterday: 0,
    thisMonth: 0,
    lastMonth: 0,
    allTime: 0,
  });

  useEffect(() => {
    const fetchSales = async () => {
      const now = new Date();
      const todayStart = new Date(now.setHours(0, 0, 0, 0));
      const yesterdayStart = new Date(todayStart);
      yesterdayStart.setDate(todayStart.getDate() - 1);
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const lastMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

      const [today, yesterday, thisMonth, lastMonth, allTime] =
        await Promise.all([
          getSalesBetween(todayStart, new Date()),
          getSalesBetween(yesterdayStart, todayStart),
          getSalesBetween(monthStart, new Date()),
          getSalesBetween(lastMonthStart, lastMonthEnd),
          getSalesBetween(), // no filter = all time
        ]);

      setData({
        today,
        yesterday,
        thisMonth,
        lastMonth,
        allTime,
      });
    };

    fetchSales();
  }, []);

  const getSalesBetween = async (from?: Date, to?: Date): Promise<number> => {
    let query = supabase
      .from("orders")
      .select("total_amount", { count: "exact" });

    if (from) query = query.gte("created_at", from.toISOString());
    if (to) query = query.lte("created_at", to.toISOString());

    const { data, error } = await query;
    if (error || !data) return 0;

    return data.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
  };

  const cards: DashboardCard[] = [
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Today Orders",
      value: `₹${data.today.toFixed(2)}`,
      className: "bg-teal-600",
    },
    {
      icon: <HiOutlineSquare3Stack3D />,
      title: "Yesterday Orders",
      value: `₹${data.yesterday.toFixed(2)}`,
      className: "bg-orange-400",
    },
    {
      icon: <HiOutlineRefresh />,
      title: "This Month",
      value: `₹${data.thisMonth.toFixed(2)}`,
      className: "bg-blue-500",
    },
    {
      icon: <HiCalendarDays />,
      title: "Last Month",
      value: `₹${data.lastMonth.toFixed(2)}`,
      className: "bg-cyan-600",
    },
    {
      icon: <HiCalendarDays />,
      title: "All-Time Sales",
      value: `₹${data.allTime.toFixed(2)}`,
      className: "bg-emerald-600",
    },
  ];

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => (
        <div
          key={`sales-overview-${index}`}
          className={cn(
            "p-6 rounded-lg flex flex-col items-center justify-center space-y-3 text-white text-center shadow",
            card.className
          )}
        >
          <div className="[&>svg]:size-8">{card.icon}</div>
          <Typography className="text-base">{card.title}</Typography>
          <Typography className="text-2xl font-semibold">
            {card.value}
          </Typography>
        </div>
      ))}
    </div>
  );
}
