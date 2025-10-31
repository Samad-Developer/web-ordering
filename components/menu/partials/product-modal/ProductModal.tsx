"use client";

import { RootState } from "@/store/store";
import { useSelector, useDispatch } from "react-redux";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { closeProductModal } from "@/store/slices/productModalSlice";
import { useRouter } from "next/navigation";
import { ProductImage } from "./gallery/ProductImage";
import { ProductModalHeader } from "./header/Header";

export const ProductModal = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isOpen, currentProduct } = useSelector((state: RootState) => state.productModal);

  const handleClose = () => {
    dispatch(closeProductModal());
    router.back();
  };

  if (!currentProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="md:max-w-4xl lg:max-w-5xl xl:max-w-6xl min-h-[90vh] overflow-hidden p-0" showCloseButton={false}>
        {/* <ProductModalProvider product={product}> */}

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
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Fixed Header */}
            <ProductModalHeader />

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto">
              {/* Mobile Image (show on small screens) */}
              <div className="lg:hidden pb-0">
                <ProductImage
                  image={currentProduct.Image}
                  alt={currentProduct.Name}
                />
              </div>

              <p>Product Modal Body will be go here</p>
            </div>

            {/* Fixed Footer */}
            {/* <ProductModalFooter onAddToCart={onAddToCart} /> */}
            <p>Product Modal Footer</p>
          </div>
        </div>
        {/* </ProductModalProvider> */}
      </DialogContent>
    </Dialog>
  );
};
