import React from "react";
import { MenuItem } from "@/types/menu.types";
import ProductCardVerticalLayout1 from "../product-card/ProductCardVerticalLayout1";
import { gridVariants, ProductCardLayout } from "@/lib/product/productCardVariants";

interface ItemsListProps {
  itemsList: MenuItem[];
  layout: ProductCardLayout;
}

const ItemsList: React.FC<ItemsListProps> = ({ itemsList, layout }) => {

  return (
    <div className={gridVariants({ layout })}>
      {itemsList.map((product) => (
        <ProductCardVerticalLayout1 product={product} key={product.Id} cardLayout={layout}/>
      ))}
    </div>
  );
};

export default ItemsList;
