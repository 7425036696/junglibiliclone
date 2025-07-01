import Link from "next/link";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Typography from "@/components/ui/typography";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// 💡 Supabase Auth User
import type { User } from "@supabase/auth-helpers-nextjs";

export const columns: ColumnDef<User>[] = [
  {
    header: "ID",
    cell: ({ row }) => (
      <Typography className="uppercase">{row.original.id.slice(-6)}</Typography>
    ),
  },
  {
    header: "Joined",
    cell: ({ row }) => format(new Date(row.original.created_at), "PP"),
  },
  {
    header: "Name",
    cell: ({ row }) => row.original.user_metadata?.name || "—",
  },
  {
    header: "Email",
    cell: ({ row }) => (
      <Typography className="block max-w-52 truncate">
        {row.original.email || "—"}
      </Typography>
    ),
  },
  {
    header: "Phone",
    cell: ({ row }) => row.original.phone || "—",
  },
 
];

export const skeletonColumns = [
  { header: "ID", cell: <Skeleton className="w-10 h-8" /> },
  { header: "Joined", cell: <Skeleton className="w-20 h-8" /> },
  { header: "Name", cell: <Skeleton className="w-24 h-8" /> },
  { header: "Email", cell: <Skeleton className="w-32 h-8" /> },
  { header: "Phone", cell: <Skeleton className="w-20 h-8" /> },
  { header: "Actions", cell: <Skeleton className="w-24 h-8" /> },
];
