export type CouponStatus = "active" | "expired";

export type Coupon = {
  id: string;
  title: string;
  couponCode: string;
  discount: number; // store 0.1 for 10%
  published: boolean;
  startTime: string;
  endTime: string;
  image?: string;
  created_at?: string;
};
