'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { useBranchValidation } from '@/hooks/useBranchValidation';
import { useCartTotals } from '@/hooks/useCartTotals';
import { formatPrice } from '@/lib/product/productHelper';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/store/hooks';
import { toggleCart } from '@/store/slices/cartSlice';

export function CheckoutButton() {
  const dispatch = useAppDispatch();
  const { locale } = useParams();

  const branch = useBranchValidation();
  const totals = useCartTotals();

  // ✅ Correct invocation (THIS was broken before)
  const canCheckout = branch.canPlaceOrder(
    totals.subtotal,
    totals.hasItems
  );

  const amountToMinimum = branch.getAmountToMinimum(totals.subtotal);

  const getButtonText = () => {
    // if (!branch.isBranchOpen) {
    //   return 'Branch Closed';
    // }

    if (!totals.hasItems) {
      return 'Cart is Empty';
    }

    if (!totals.meetsMinimumOrder) {
      return `Add ${formatPrice(amountToMinimum)} more`;
    }

    return 'Proceed to Checkout';
  };

  const handleCheckout = () => {
    dispatch(toggleCart(false));
  };

  // ✅ Do NOT allow Link unless checkout is valid
  // if (!canCheckout) {
  //   return (
  //     <Button
  //       disabled
  //       className="w-full rounded-lg h-14 text-base font-semibold bg-primary text-secondary disabled:opacity-50 disabled:cursor-not-allowed"
  //     >
  //       {getButtonText()}
  //       <ArrowRight className="ml-2" />
  //     </Button>
  //   );
  // }

  return (
    <Link href={`/${locale}/checkout`}>
      <Button
        onClick={handleCheckout}
        className="w-full rounded-lg h-14 text-base font-semibold bg-primary text-secondary"
      >
        {getButtonText()}
        <ArrowRight className="ml-2" />
      </Button>
    </Link>
  );
}
