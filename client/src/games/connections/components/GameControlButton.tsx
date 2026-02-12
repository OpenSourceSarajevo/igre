import React from "react";
import clsx from "clsx";

type Variant = "default" | "primary";

interface GameControlButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const GameControlButton: React.FC<GameControlButtonProps> = ({
  children,
  variant = "default",
  className,
  disabled,
  type = "button",
  ...props
}) => {
  const baseStyles =
    "px-6 py-3 sm:px-5 sm:py-[10px] text-sm sm:text-base md:text-lg font-semibold rounded-[24px] transition-all duration-200 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none";

  const variants: Record<Variant, string> = {
    default: "bg-tile-bg text-app-text hover:brightness-90",
    primary: "bg-app-text text-app-bg hover:brightness-90",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
};

export default GameControlButton;
