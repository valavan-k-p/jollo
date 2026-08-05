/* Monochrome symbol set used in place of emojis sitewide.
   All icons inherit color via currentColor. */

interface IconProps {
  className?: string;
}

export const PhoneIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M14.5 6C16 6 17.3 7 17.8 8.4L20 14.6C20.5 16 20.1 17.6 19 18.6L16.4 21C18.3 25.1 21.6 28.4 25.7 30.3L28.1 27.7C29.1 26.6 30.7 26.2 32.1 26.7L38.3 28.9C39.7 29.4 40.7 30.7 40.7 32.2V38.5C40.7 40.4 39.1 42 37.2 41.9C20.5 41 7.7 28.2 6.8 11.5C6.7 9.6 8.3 8 10.2 8H14.5V6Z"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const MailIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <rect x="5" y="10" width="38" height="28" rx="3" stroke="currentColor" strokeWidth="3" />
    <path d="M6 12L24 27L42 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/* Four-point star / spark */
export const SparkIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M24 2C25.5 14 34 22.5 46 24C34 25.5 25.5 34 24 46C22.5 34 14 25.5 2 24C14 22.5 22.5 14 24 2Z" />
  </svg>
);

/* Eight-point asterisk / starburst */
export const StarburstIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M24 4V44M4 24H44M9.9 9.9L38.1 38.1M38.1 9.9L9.9 38.1"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
    />
  </svg>
);

/* Concentric target */
export const TargetIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="3" />
    <circle cx="24" cy="24" r="11" stroke="currentColor" strokeWidth="3" />
    <circle cx="24" cy="24" r="3.5" fill="currentColor" />
  </svg>
);

export const ArrowUpRightIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12 36L36 12M36 12H18M36 12V30"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* Two interlinked rings */
export const RingsIcon = ({ className = "" }: IconProps) => (
  <svg viewBox="0 0 48 48" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <circle cx="18" cy="24" r="12" stroke="currentColor" strokeWidth="3" />
    <circle cx="30" cy="24" r="12" stroke="currentColor" strokeWidth="3" />
  </svg>
);
