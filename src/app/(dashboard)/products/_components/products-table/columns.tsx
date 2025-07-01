import Link from "next/link";
import Image from "next/image";
import { ZoomIn, PenSquare, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { toast } from "sonner"; // make sure this is importeds
import { Badge } from "@/components/ui/badge";
import {supabase} from "@/lib/supbase"
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import Typography from "@/components/ui/typography";
import EditProduct from "../EditProduct";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
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

import { formatAmount } from "@/helpers/formatAmount";
import { SkeletonColumn } from "@/types/skeleton";
import { Product } from "@/types/product";

const handleSwitchChange = () => {};

export const columns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    header: "Product",
    cell: ({ row }) => (
      <div className="flex gap-2 items-center">
        <Image
          src={row.original.images?.[0] || "/placeholder.png"}
          alt={row.original.name}
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
        <Typography className="capitalize block truncate">
          {row.original.name}
        </Typography>
      </div>
    ),
  },
  {
    header: "Original Price",
    cell: ({ row }) => formatAmount(row.original.originalPrice),
  },
  {
    header: "Price",
    cell: ({ row }) => formatAmount(row.original.price),
  },
 {
  header: "Actions",
  cell: ({ row }) => (
    <div className="flex items-center gap-1">
      {/* Edit Sheet */}
      <Sheet>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <PenSquare className="size-5" />
              </Button>
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Edit Product</p>
          </TooltipContent>
        </Tooltip>
        <SheetContent className="flex flex-col">
          <EditProduct product={row.original} />
        </SheetContent>
      </Sheet>

      {/* Delete Alert */}
      <AlertDialog>
        <Tooltip>
          <TooltipTrigger asChild>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Trash2 className="size-5" />
              </Button>
            </AlertDialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Delete Product</p>
          </TooltipContent>
        </Tooltip>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the product.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                // Delete logic
                const { error } = await supabase
                  .from("products")
                  .delete()
                  .eq("id", row.original.id);
                if (error) {
                  toast.error("Failed to delete");
                } else {
                  toast.success("Product deleted");
                  // Optional: Refetch table
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  ),
}

];

export const skeletonColumns: SkeletonColumn[] = [
  {
    header: <Checkbox disabled checked={false} />,
    cell: <Skeleton className="size-4 rounded-sm" />,
  },
  {
    header: "Product",
    cell: (
      <div className="flex gap-2 items-center">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="w-28 h-8" />
      </div>
    ),
  },
  {
    header: "Original Price",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Price",
    cell: <Skeleton className="w-20 h-8" />,
  },
  {
    header: "Actions",
    cell: <Skeleton className="w-20 h-8" />,
  },
];
