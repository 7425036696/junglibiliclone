import { Metadata } from "next";

import PageTitle from "@/components/shared/PageTitle";
import CouponFilters from "./_components/CouponFilters";

export const metadata: Metadata = {
  title: "Coupons",
};

export default async function CouponsPage() {
  return (
    <section>
      <PageTitle>Coupons</PageTitle>

      <CouponFilters />
    </section>
  );
}
