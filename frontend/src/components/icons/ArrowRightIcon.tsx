import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const ArrowRightIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
  </svg>
);

export default ArrowRightIcon;
