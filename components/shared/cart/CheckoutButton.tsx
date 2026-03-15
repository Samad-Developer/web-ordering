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
        className="w-full group flex items-center justify-center gap-2.5 h-14 rounded-2xl text-[16px] font-bold bg-primary text-secondary cursor-pointer transition-all hover:bg-primary/90 active:scale-[0.98]"
      >
        Checkout
  <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
    </Link>
  );
}
