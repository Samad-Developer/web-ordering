"use client";

import React from "react";
import { X, Share2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useProductModal } from "../ProductModalContext";
import { closeProductModal } from "@/store/slices/productModalSlice";
import { DialogClose } from "@/components/ui/dialog";

export function ProductModalHeader() {
  const { product } = useProductModal();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.Name,
          text: `Check out ${product.Name}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share failed:", err);
      }
    }
  };

  const handleClose = () => {
    dispatch(closeProductModal());
    router.back();
  };

  return (
    <div className="sticky top-0 z-10 bg-popup-header-bg border-b px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-popup-header-fg truncate pr-4">
        {product.Name}
      </h2>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="icon"
          onClick={handleShare}
          className="bg-primary rounded-full text-secondary cursor-pointer"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        {/* <Button
          size="icon"
          onClick={handleClose}
          className="bg-red-500 rounded-full text-white hover:text-slate-50 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </Button> */}

        <DialogClose asChild>
          <Button type="button" size="icon" className="bg-primary rounded-full text-secondary cursor-pointer">
            <X className="h-5 w-5" />
          </Button>
        </DialogClose>
      </div>
    </div>
  );
}
