import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import CustomerFilters from "./_components/CustomerFilters";

export const metadata: Metadata = {
  title: "Customers",
};

export default async function CustomersPage() {
  return (
    <section>
      <PageTitle>Customers</PageTitle>

      <CustomerFilters />   
       </section>
  );
}
