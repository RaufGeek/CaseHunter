import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const CheckIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
  </svg>
);

export default CheckIcon;
