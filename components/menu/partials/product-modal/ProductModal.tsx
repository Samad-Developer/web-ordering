"use client";

import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { ProductModalHeader } from "./header/Header";
import { ProductModalFooter } from "./footer/Footer";
import { ProductImage } from "./gallery/ProductImage";
import ProductModalBody from "./body/ProductModalBody";
import { useSelector, useDispatch } from "react-redux";
import { ProductModalProvider } from "./ProductModalContext";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closeProductModal } from "@/store/slices/productModalSlice";

export const ProductModal = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isOpen, currentProduct } = useSelector((state: RootState) => state.productModal);

  const handleClose = () => {
    dispatch(closeProductModal());
    router.back();
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
