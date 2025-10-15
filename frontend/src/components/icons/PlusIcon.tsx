import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const PlusIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

export default PlusIcon;
