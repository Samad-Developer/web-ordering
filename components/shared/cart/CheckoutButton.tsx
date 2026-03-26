import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { toggleCart } from '@/store/slices/cartSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectAvailableModes } from '@/store/slices/addressSlice';
import { useFreshBranchStatus } from '@/hooks/useFreshBranchStatus';

export function CheckoutButton() {
  const { locale } = useParams();
  const dispatch = useAppDispatch();
  const { isBranchOpen } = useFreshBranchStatus();
  const availableModes = useAppSelector(selectAvailableModes);
  
  const isTemporarilyClosed =
  !availableModes.delivery && !availableModes.pickup || !isBranchOpen;

  const handleCheckout = () => {
    if (isTemporarilyClosed) {
      return;
    }
    dispatch(toggleCart(false));
  };

const buttonText = !isBranchOpen
  ? 'Branch Closed'
  : !availableModes.delivery && !availableModes.pickup
  ? 'Ordering Temporarily Unavailable'
  : 'Checkout';

  return (
    <Link
      href={`/${locale}/checkout`}
      onClick={handleCheckout}
      className={isTemporarilyClosed ? 'pointer-events-none' : ''}
    >
      <Button
        disabled={isTemporarilyClosed}
        className="w-full group flex items-center justify-center gap-2.5 h-14 rounded-2xl text-[16px] font-bold bg-primary text-secondary transition-all hover:bg-primary/90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {buttonText}
        {!isTemporarilyClosed && (
          <ArrowRight className="h-4.5 w-4.5 transition-transform group-hover:translate-x-1" />
        )}
      </Button>
    </Link>
  );
}