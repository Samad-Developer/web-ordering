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
  const logoSrc = footerLogo?.src || "/assets/images/logo/logo.webp";

  if (!logoSrc) return null;

  return (
    <div className="flex justify-center items-center">
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
            md:w-44     /* tablets */
            lg:w-52     /* desktops */
            xl:w-60     /* large screens */
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
