import Link from "next/link";

const Arrow = () => (
  <svg viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M-2.29154e-07 6.75758L-2.95383e-07 5.24242L9.09091 5.24242L4.92424 1.07576L6 -2.63424e-07L12 6L6 12L4.92424 10.9242L9.09091 6.75758L-2.29154e-07 6.75758Z"
      fill="currentColor"
    />
  </svg>
);

interface ArrowButtonProps {
  href?: string;
  children: React.ReactNode;
  dark?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * Clone-port icon button: label + yellow circle whose diagonal arrow slides
 * out and is replaced by the next one on hover.
 */
export default function ArrowButton({ href, children, dark, onClick, className = "" }: ArrowButtonProps) {
  const inner = (
    <>
      <span className="cp-btn__text">{children}</span>
      <span className="cp-btn__icon">
        <span className="cp-btn__arrows">
          <Arrow />
          <Arrow />
        </span>
      </span>
    </>
  );
  const cls = `cp-btn ${dark ? "is-dark" : ""} ${className}`;

  if (href) {
    return (
      <Link href={href} className={cls} onClick={onClick}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" className={cls} onClick={onClick}>
      {inner}
    </button>
  );
}
