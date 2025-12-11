"use client";

import { useRouter } from "next/navigation";
import { ProductModalHeader } from "./header/Header";
import { ProductModalFooter } from "./footer/Footer";
import { ProductImage } from "./gallery/ProductImage";
import ProductModalBody from "./body/ProductModalBody";
import { ProductModalProvider } from "./ProductModalContext";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closeProductModal } from "@/store/slices/productModalSlice";
import { selectProductModal } from "@/store/slices/productModalSlice";
import { selectOpenedFromUrl } from "@/store/slices/productModalSlice";

export const ProductModal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const openedFromUrl = useAppSelector(selectOpenedFromUrl)
  const { isOpen, currentProduct } = useAppSelector(selectProductModal);

  const handleClose = () => {
    dispatch(closeProductModal());

    if (openedFromUrl) {
      router.push('/');       
    } else {
      router.back();        
    }
  };

  if (!currentProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent
        className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl min-h-[90vh] overflow-hidden p-0"
        showCloseButton={false}
      >
        <ProductModalProvider product={currentProduct}>
          {/* Two Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] h-full max-h-[90vh]">

            {/* LEFT COLUMN - Image Only (No Header/Footer) */}
            <div className="hidden lg:block md:p-5">
              <ProductImage
                image={currentProduct.Image}
                alt={currentProduct.Name}
              />
            </div>

            {/* RIGHT COLUMN - Header + Body + Footer */}
            <div className="lg:border-l flex flex-col h-full max-h-[90vh]">
              {/* Fixed Header */}
              <ProductModalHeader />
              {/* Scrollable Body */}
              <ProductModalBody />
              {/* Fixed Footer */}
              <ProductModalFooter />
            </div>

          </div>
        </ProductModalProvider>
      </DialogContent>
    </Dialog>
  );
};
