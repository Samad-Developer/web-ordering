'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, UseDispatch } from 'react-redux';
import { setProductFromUrl } from '@/store/slices/productModalSlice';
import { ProductItem } from '@/types/product.types';

const demoProduct: ProductItem = {
  Id: 9514,
  CategoryId: "2592",
  Code: "",
  Name: "Tenders & Drink Combo",
  DepartmentName: "430",
  Price: 0,
  Discount: null,
  TaxAmount: 0,
  Quantity: 0,
  Image: "/ProductImages/a42830be-0e8c-46f9-9e0b-9890fee75166.jpg",
  Comment: "",
  IsKot: false,
  ItemFOC: false,
  Variations: [
    {
      Id: 13459,
      Size: { Id: 960, Name: "-" },
      Flavour: { Id: 609, Name: "-" },
      Price: 410,
      Discount: null,
      ItemChoices: [
        {
          Id: 4434,
          Name: "Choose your Drink",
          Quantity: 1,
          MaxChoice: 1,
          ItemOptions: [
            { Id: 13466, Name: "Soft Drink Of Choice", Price: 0 },
            { Id: 13465, Name: "Soft Drink Of Choice", Price: 0 },
            { Id: 134234, Name: "Soft Drink Of Choice", Price: 0 },
            { Id: 1342367, Name: "Soft Drink Of Choice", Price: 0 },
            { Id: 1322467, Name: "Soft Drink Of Choice", Price: 0 }
          ]
        },
        {
          Id: 4435,
          Name: "Add Ons (optional)",
          Quantity: 0,
          MaxChoice: 0,
          ItemOptions: [
            { Id: 13473, Name: "Chicken Fillet", Price: 300 },
            { Id: 13472, Name: "Extra American Cheese", Price: 120 },
            { Id: 13468, Name: "Large Dip", Price: 120 },
            { Id: 13471, Name: "Sauteed Mushrooms", Price: 200 },
            { Id: 13470, Name: "Small Plain Fries", Price: 250 },
            { Id: 13476, Name: "Beef Bacon", Price: 270 },
            { Id: 13476, Name: "Beef Bacon", Price: 270 },
            { Id: 13476, Name: "Beef Bacon", Price: 270 }
          ]
        }
      ]
    }
  ]
};


export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // const loadProduct = async () => {
    //   // Extract product ID from slug
    //   const slug = params.slug as string;
    //   const productId = parseInt(slug.split('-').pop() || '0');

    //   if (!productId) {
    //     router.push('/');
    //     return;
    //   }

    //   try {
    //     // Fetch product from API
    //     const response = await fetch(`/api/products/${productId}`);
    //     const product: ProductItem = await response.json();

    //     // Dispatch to Redux (opens modal)
    //     dispatch(setProductFromUrl(product));

    //   } catch (error) {
    //     console.error('Product not found:', error);
    //     router.push('/');
    //   }
    // };

    // loadProduct();

  }, [params.slug, dispatch, router]);


  dispatch(setProductFromUrl(demoProduct));
  return null;
}