'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';

export function CheckoutButton() {
  const dispatch = useAppDispatch();
  const { locale } = useParams();

  const handleCheckout = () => {
    dispatch(toggleCart(false));
  };

  return (
    <Link href={`/${locale}/checkout`}>
      <Button
        onClick={handleCheckout}
        className="w-full rounded-xl h-12 text-base font-semibold bg-primary text-secondary cursor-pointer transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Proceed to Checkout
        <ArrowRight className="ml-2" />
      </Button>
    </Link>
  );
}
