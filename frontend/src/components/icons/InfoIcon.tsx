import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const InfoIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M12,4.5A7.5,7.5,0,0,1,19.5,12A7.5,7.5,0,0,1,12,19.5A7.5,7.5,0,0,1,4.5,12A7.5,7.5,0,0,1,12,4.5M12,2A10,10,0,0,0,2,12A10,10,0,0,0,12,22A10,10,0,0,0,22,12A10,10,0,0,0,12,2M11,17H13V15H11V17M13,13H11V7H13V13Z" />
  </svg>
);

export default InfoIcon;
