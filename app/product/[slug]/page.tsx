 // app/product/[slug]/page.tsx

'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, UseDispatch } from 'react-redux';
import { setProductFromUrl } from '@/store/slices/productModalSlice';
import { ProductItem } from '@/types/product.types';

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

  // Redirect to home (modal will overlay on top)
//   useEffect(() => {
//     router.push('/');
//   }, [router]);
 dispatch(setProductFromUrl());
  return null; // This page doesn't render anything
}