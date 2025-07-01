import { OrderStatus } from "@/types/order";

import { BadgeVariantProps } from "@/components/ui/badge";

export const OrderBadgeVariants: Record<OrderStatus, BadgeVariantProps> = {
  pending: "secondary",
  processing: "outline",
  delivered: "success",
  cancel: "destructive",
};



