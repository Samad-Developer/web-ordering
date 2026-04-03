import Link from 'next/link';
import { ArrowRight, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAddressApiData } from '@/store/slices/addressSlice';
import { useFreshBranchStatus } from '@/hooks/useFreshBranchStatus';

export function CheckoutButton() {
  const { locale } = useParams();
  const dispatch = useAppDispatch();
  const { isBranchOpen } = useFreshBranchStatus();
  const apiData = useAppSelector(selectAddressApiData);

  // Direct flags from API
  const isDeliveryEnabled = apiData?.dataPayload?.Theme?.Settings?.IS_DELIVERY_ENABLED ?? false;
  const isPickupEnabled = apiData?.dataPayload?.Theme?.Settings?.IS_PICKUP_ENABLED ?? false;
  const isTemporarilyClosed = !isDeliveryEnabled && !isPickupEnabled;

  const handleCheckout = () => {
    if (isTemporarilyClosed) {
      return;
    }
    dispatch(toggleCart(false));
  };

  const buttonText = !isBranchOpen ? 'Sorry We Are Closed Right Now' : !isDeliveryEnabled && !isPickupEnabled
    ? 'Ordering Temporarily Unavailable'
    : 'Checkout';

  // --- Render disabled button if temporarily closed ---
  if (isTemporarilyClosed || !isBranchOpen) {
    return (
      <Button
        disabled
        className="w-full flex items-center justify-center gap-2 h-14 rounded-2xl text-[16px] font-semibold 
        bg-red-500 text-secondary cursor-not-allowed opacity-50"
      >
        {buttonText}
      </Button>
    );
  }

  return (
    <Link
      href={`/${locale}/checkout`}
      prefetch={true}
      onClick={handleCheckout}
    >
      <Button
        className="w-full group flex items-center justify-center gap-2.5 h-14 rounded-2xl text-[16px] font-bold cursor-pointer 
        bg-primary text-secondary transition-all duration-200 
        hover:bg-primary/90 active:scale-[0.98] 
        disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
        <ArrowRight
          className="h-4.5 w-4.5 transition-transform duration-200 ease-out group-hover:translate-x-1.5"
        />
      </Button>
    </Link>
  );
}