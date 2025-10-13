import Image from "next/image";
import React from "react";

interface SvgIconProps {
  src: string;
  alt?: string;
  size?: number;
  className?: string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({
  src,
  alt = "icon",
  size = 24,
  className = "",
}) => {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={className}
    />
  );
};
