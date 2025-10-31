"use client"

import React from "react";
import { X, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { useProductModal } from '../product-modal-context';
import { closeProductModal } from "@/store/slices/productModalSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";

export function ProductModalHeader() {
  //   const { product } = useProductModal();
  const router = useRouter();
  const dispatch = useDispatch();

  const handleShare = async () => {
    // if (navigator.share) {
    //   try {
    //     await navigator.share({
    //       title: product.Name,
    //       text: `Check out ${product.Name}`,
    //       url: window.location.href,
    //     });
    //   } catch (err) {
    //     console.log('Share failed:', err);
    //   }
    // }
  };

  const handleClose = () => {
    dispatch(closeProductModal());
    router.back();
  };

  return (
    <div className="sticky top-0 z-10 bg-white border-b px-6 py-4 flex items-center justify-between">
      <h2 className="text-xl font-semibold text-gray-900 truncate pr-4">
        Product Name
      </h2>

      <div className="flex items-center gap-2 flex-shrink-0">
        <Button
          size="icon"
          onClick={handleShare}
          className="bg-red-500 rounded-full text-white hover:text-slate-50 cursor-pointer"
        >
          <Share2 className="h-5 w-5" />
        </Button>

        <Button
          size="icon"
          onClick={handleClose}bg-red500 rounded-full 
          className="bg-red-500 rounded-full text-white hover:text-slate-50 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
