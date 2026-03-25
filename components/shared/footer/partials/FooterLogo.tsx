// components/footer/FooterLogo.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";

interface FooterLogoProps {
  footerLogo?: {
    src: string;
  };
}

export const FooterLogo: React.FC<FooterLogoProps> = ({ footerLogo }) => {
  const logoSrc = footerLogo?.src || "/assets/images/logo/ygen.png";

  if (!logoSrc) return null;

  return (
    <div className="flex justify-center items-center rounded-full overflow-hidden">
      <Link href="/" className="block w-fit">
        <Image
          src={logoSrc}
          alt="logo"
          width={300}
          height={300}
          className="
            h-auto 
            w-28        /* mobile */
            sm:w-36     /* small devices */
            transition-all 
            duration-300 
            hover:scale-105

          "
          priority
        />
      </Link>
    </div>
  );
};
