import React from "react";
import { MenuItem } from "@/types/menu.types";
import ProductCardVerticalLayout1 from "../product-card/ProductCardVerticalLayout1";

interface ItemsListProps {
  itemsList: MenuItem[];
}

const ItemsList: React.FC<ItemsListProps> = ({ itemsList }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-8 mt-4">
      {itemsList.map((product) => (
        <ProductCardVerticalLayout1 product={product} key={product.Id}/>
      ))}
    </div>
  );
};

export default ItemsList;
