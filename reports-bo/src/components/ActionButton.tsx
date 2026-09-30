import type { MouseEvent, MouseEventHandler, ReactNode } from "react";

type ActionButtonProps = {
  as?: "a";
  href?: string;
  variant?: "primary" | "secondary" | "destructive" | "text";
  size?: "default" | "slim";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: ReactNode;
  onClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
};

const variantClasses = {
  primary: "border border-[#1e72c4] bg-[#1e72c4] text-white shadow-[0px_1px_0px_0px_rgba(0,0,0,0.1)] hover:border-[#1558a0] hover:bg-[#1558a0]",
  secondary: "border border-[#e3e2dd] bg-white text-[#22201f] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] hover:bg-[#f9f8f4]",
  destructive: "border border-[#fedada] bg-[#fef3f2] text-[#b11819] shadow-[0px_1px_0px_0px_rgba(0,0,0,0.06)] hover:bg-[#fedada]",
  text: "border border-transparent bg-transparent text-[#22201f] hover:bg-[#f9f8f4]",
};

export default function ActionButton({
  variant = "secondary",
  size = "default",
  as,
  href,
  children,
  className = "",
  type = "button",
  disabled,
  onClick,
}: ActionButtonProps) {
  const classes = `inline-flex shrink-0 items-center justify-center gap-[8px] rounded-[8px] font-['Inter:Semibold'] text-[14px] leading-[20px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1e72c4] disabled:cursor-not-allowed disabled:border-[#e3e2dd] disabled:bg-[#e3e2dd] disabled:text-[#999894] disabled:shadow-none ${size === "slim" ? "h-[32px] px-[12px]" : "h-[40px] px-[16px]"} ${variantClasses[variant]} ${className}`;

  if (as === "a") {
    return <a href={href} onClick={onClick as MouseEventHandler<HTMLAnchorElement>} className={classes}>{children}</a>;
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}
