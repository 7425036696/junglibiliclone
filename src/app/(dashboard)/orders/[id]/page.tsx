import PageTitle from "@/components/shared/PageTitle";
import Typography from "@/components/ui/typography";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

import { fetchOrder } from "@/data/orders";
import { OrderBadgeVariants } from "@/constants/badge";
import { OrderStatus } from "@/types/order";

type PageParams = { params: { id: string } };

export default async function OrderPage({ params: { id } }: PageParams) {
  const order = await fetchOrder(id);

  const subtotal = order.items.reduce(
    (sum: number, item: any) => sum + item.quantity * item.price,
    0
  );

  const shipping = order.shipping_cost ?? 0;
  const discount = order.discount ?? 0;
  const total = subtotal + shipping - discount;

  return (
    <section>
      <PageTitle>Invoice</PageTitle>
      <Card className="mb-8 p-4 lg:p-6"> 
        {/* Header */}
        <div className="flex justify-between">
          <div>
            <Typography variant="h2" className="uppercase mb-1.5 tracking-wide">
              Invoice
            </Typography>
          <Badge variant={OrderBadgeVariants[order.status as OrderStatus]}>
  {order.status}
</Badge>

          </div>
          <div className="text-right text-sm">
            <Typography variant="h2">Your Company</Typography>
            <Typography>123 Street, City, Country</Typography>
            <Typography>+1 234 567 890</Typography>
            <Typography>email@company.com</Typography>
            <Typography>www.company.com</Typography>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Invoice Details */}
        <div className="flex justify-between mb-10">
          <div>
            <Typography className="font-semibold uppercase mb-1">
              Date
            </Typography>
            <Typography>
              {new Date(order.created_at).toLocaleDateString()}
            </Typography>
          </div>
          <div>
            <Typography className="font-semibold uppercase mb-1">
              Invoice No
            </Typography>
            <Typography>#{order.id.slice(-6)}</Typography>
          </div>
          <div className="text-right">
            <Typography className="font-semibold uppercase mb-1">
              Invoice To
            </Typography>
            <Typography>{order.shipping_address?.name}</Typography>
            {order.shipping_address?.phone && (
              <Typography>{order.shipping_address.phone}</Typography>
            )}
            {order.shipping_address?.address && (
              <Typography>
                {order.shipping_address.address},{" "}
                {order.shipping_address.city}
              </Typography>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div className="border rounded-md overflow-hidden mb-10">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>SR.</TableHead>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-center">Price</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item: any, idx: number) => (
                <TableRow key={idx}>
                  <TableCell>{idx + 1}</TableCell>
                  <TableCell>{item.product?.name ?? "Unnamed Product"}</TableCell>
                  <TableCell className="text-center">{item.quantity}</TableCell>
                  <TableCell className="text-center">
                    ₹{item.price.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-right">
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Summary */}
        <div className="bg-background rounded-lg p-6 mb-4 flex flex-col md:flex-row md:justify-end gap-4">
          <div>
            <Typography className="font-medium uppercase mb-1 text-sm">
              Subtotal
            </Typography>
            <Typography>₹{subtotal.toFixed(2)}</Typography>
          </div>
          <div>
            <Typography className="font-medium uppercase mb-1 text-sm">
              Shipping
            </Typography>
            <Typography>₹{shipping.toFixed(2)}</Typography>
          </div>
          <div>
            <Typography className="font-medium uppercase mb-1 text-sm">
              Discount
            </Typography>
            <Typography>₹{discount.toFixed(2)}</Typography>
          </div>
          <div>
            <Typography className="font-medium uppercase mb-1 text-sm">
              Total
            </Typography>
            <Typography className="text-xl font-semibold text-primary">
              ₹{total.toFixed(2)}
            </Typography>
          </div>
        </div>

        {/* Print Button */}
        <div className="flex justify-end">
          <Button size="lg" onClick={() => window.print()}>
            Print Invoice <Printer className="ml-2 size-4" />
          </Button>
        </div>
      </Card>
    </section>
  );
}
