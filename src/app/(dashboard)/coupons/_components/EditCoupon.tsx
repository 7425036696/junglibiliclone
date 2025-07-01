"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/lib/supbase";

type Props = {
  onSave: () => void;
  coupon?: {
    id: string;
    code: string;
    discount: number;
    expiresAt: string;
  };
};

export default function EditCoupon({ onSave, coupon }: Props) {
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState("");
  const [expiresAt, setExpiresAt] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (coupon) {
      setCode(coupon.code || "");
      setDiscount(coupon.discount?.toString() || "");
      setExpiresAt(coupon.expiresAt?.slice(0, 10) || "");
    }
  }, [coupon]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (  !code || !discount || !expiresAt) {
      toast.error("Please fill all fields.");
      return;
    }

    setLoading(true);

    try {
      if (coupon) {
        // UPDATE
        const { error } = await supabase
          .from("coupons")
          .update({
            code,
            discount: parseFloat(discount),
            expires_at: new Date(expiresAt).toISOString(),
          })
          .eq("id", coupon.id);

        if (error) throw error;
        toast.success("Coupon updated successfully!");
      } else {
        // INSERT
        const { error } = await supabase.from("coupons").insert({
          code,
          discount: parseFloat(discount),
          expires_at: new Date(expiresAt).toISOString(),
        });

        if (error) throw error;
        toast.success("Coupon created successfully!");
      }

      onSave();
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-5">
      

      <div className="space-y-2">
        <Label>Code</Label>
        <Input
          placeholder="e.g. SUMMER2025"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Discount (%)</Label>
        <Input
          type="number"
          placeholder="e.g. 10"
          value={discount}
          onChange={(e) => setDiscount(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Expires At</Label>
        <Input
          type="date"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? "Saving..." : coupon ? "Update Coupon" : "Create Coupon"}
      </Button>
    </form>
  );
}
