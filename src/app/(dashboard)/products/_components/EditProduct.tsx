"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
            import Image from "next/image";

import { SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";

const supabase = createPagesBrowserClient();

export default function EditProduct({
  product,
  onSave,
}: {
  product?: Product;
  onSave?: () => void;
}) {
  const [name, setName] = useState(product?.name || "");
  const [price, setPrice] = useState(product?.price || 0);
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice || 0);
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || "");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

const handleImageUpload = async (file: File) => {
  const filePath = `public/${Date.now()}-${file.name}`;
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Upload error:", error.message);
    toast.error("Image upload failed");
    return null;
  }

  const { data: publicData } = supabase
    .storage
    .from("product-images")
    .getPublicUrl(filePath);

  if (publicData?.publicUrl) {
    setImageUrl(publicData.publicUrl); // ✅ SET THE STATE HERE
    toast.success("Image uploaded successfully");
  }

  return publicData?.publicUrl;
};


  const handleSubmit = async () => {
    if (!name || !price || !originalPrice || !imageUrl) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    const payload = {
      name,
      price,
      originalPrice,
      images: [imageUrl],
    };

    let error;
    if (product?.id) {
      // update
      ({ error } = await supabase.from("products").update(payload).eq("id", product.id));
    } else {
      // create
      ({ error } = await supabase.from("products").insert(payload));
    }

    setLoading(false);

    if (error) {
      toast.error("Something went wrong");
    } else {
      toast.success(`Product ${product?.id ? "updated" : "created"} successfully`);
      onSave?.();
    }
  };

  return (
    <>
      <SheetHeader className="flex-row gap-4 justify-between text-left bg-background p-6">
        <div className="flex flex-col">
          <SheetTitle>{product?.id ? "Edit Product" : "Add Product"}</SheetTitle>
          <SheetDescription>
            {product?.id ? "Edit the product details below." : "Add a new product below."}
          </SheetDescription>
        </div>

        <SheetClose asChild>
          <Button variant="ghost" size="icon" className="text-foreground flex-shrink-0">
            ×
          </Button>
        </SheetClose>
      </SheetHeader>

      <div className="flex-grow grid gap-4 py-4 px-6">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">Name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right">Price</Label>
          <Input id="price" type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="originalPrice" className="text-right">Original Price</Label>
          <Input id="originalPrice" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="col-span-3" />
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="images" className="text-right">Image</Label>
          <Input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
            className="col-span-3"
          />
        </div>

        {imageUrl && (
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-1"></div>

<Image
  src={imageUrl}
  alt="Preview"
  width={200}
  height={200}
  className="object-cover rounded"
/>

          </div>
        )}
      </div>

      <SheetFooter className="px-6 pb-6 flex gap-3">
        <SheetClose asChild>
          <Button variant="secondary" className="w-full">Cancel</Button>
        </SheetClose>
        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Saving..." : product?.id ? "Save Changes" : "Create Product"}
        </Button>
      </SheetFooter>
    </>
  );
}
