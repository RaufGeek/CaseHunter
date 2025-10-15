import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const UpgradeIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1"
    className={className}
    style={style}
  >
    <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
    <path d="M7.41 11.41L12 6.83l4.59 4.58L18 10l-6-6-6 6z" />
    <path d="M7.41 7.41L12 2.83l4.59 4.58L18 6l-6-6-6 6z" />
  </svg>
);

export default UpgradeIcon;
