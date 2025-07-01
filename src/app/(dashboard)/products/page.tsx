import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import ProductFilters from "./_components/ProductFilters";

export const metadata: Metadata = {
  title: "Products",
};

export default async function ProductsPage() {
  return (
    <section>
      <PageTitle>Products</PageTitle>
      <ProductFilters />
    </section>
  );
}
