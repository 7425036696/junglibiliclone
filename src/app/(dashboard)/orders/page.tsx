import OrderFilters from "./_components/OrderFilters";

export default function OrderPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <OrderFilters />
    </div>
  );
}
