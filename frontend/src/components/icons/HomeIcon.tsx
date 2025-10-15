import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const HomeIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
  </svg>
);

export default HomeIcon;
