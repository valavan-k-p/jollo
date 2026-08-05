import { forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost" | "dark";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  href?: string;
  external?: boolean;
  arrow?: boolean;
  block?: boolean;
}

const variants: Record<Variant, string> = {
  primary: "jbtn--primary",
  outline: "jbtn--outline",
  ghost: "jbtn--ghost",
  dark: "jbtn--dark",
};

const sizes: Record<Size, string> = {
  sm: "jbtn--sm",
  md: "",
  lg: "jbtn--lg",
};

const Arrow = () => (
  <span className="jbtn__icon" aria-hidden="true">
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 8h10M9 4l4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </span>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      href,
      external,
      arrow,
      block,
      children,
      className,
      ...props
    },
    ref
  ) => {
    const classes = cn(
      "jbtn",
      variants[variant],
      sizes[size],
      block && "jbtn--block",
      className
    );

    const content = (
      <>
        {children}
        {arrow && <Arrow />}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={classes}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
