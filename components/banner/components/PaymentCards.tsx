import React from 'react';
import Image from 'next/image';

export const PaymentCards: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 flex gap-2 z-10">
      <div className="bg-white rounded px-2 py-1 shadow-md">
        <Image
          src="/assets/images/payment-modes/visa.svg"
          alt="Visa"
          width={50}
          height={30}
          className="h-7 w-auto"
        />
      </div>
      <div className="bg-white rounded px-2 py-1 shadow-md">
        <Image
          src="/assets/images/payment-modes/mastercard.svg"
          alt="Mastercard"
          width={50}
          height={30}
          className="h-7 w-auto"
        />
      </div>
    </div>
  );
};