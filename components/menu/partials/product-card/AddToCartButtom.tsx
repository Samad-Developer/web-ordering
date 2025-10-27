import React from "react";
import { ShoppingCart, Loader2 } from "lucide-react";

interface AddToCartButtonProps {
  onClick: () => void;
  text?: string;
  showIcon?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  onClick,
  text = "ADD",
  showIcon = false,
  isLoading = false,
  disabled = false,
  className = "",
  variant = "primary",
  size = "md",
}) => {
  const variantClasses = {
    primary: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
    secondary: "bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800",
    outline:
      "bg-white text-red-600 border-2 border-red-600 hover:bg-red-50 active:bg-red-100",
  };

  const sizeClasses = {
    sm: "py-2 px-4 text-sm",
    md: "py-3 px-6 text-base",
    lg: "py-4 px-8 text-lg",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      type="button"
      className={`
        w-full font-semibold rounded-lg transition-all duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        flex items-center justify-center gap-2
        focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
        shadow-md hover:shadow-lg active:shadow-sm
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${className}
      `}
      aria-label={text}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Adding...</span>
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-5 h-5" />}
          <span>{text}</span>
        </>
      )}
    </button>
  );
};
