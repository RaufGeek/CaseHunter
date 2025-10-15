import React from "react";

interface IconProps {
  className?: string;
  style?: React.CSSProperties;
}

const LeaderboardIcon: React.FC<IconProps> = ({ className, style }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M16,1H4C2.89,1 2,1.89 2,3V17H4V3H16V1M16.5,5H7.5C6.67,5 6,5.67 6,6.5V22.5L12,19.5L18,22.5V6.5C18,5.67 17.33,5 16.5,5M14,11H10V9H14V11M14,15H10V13H14V15Z" />
  </svg>
);

export default LeaderboardIcon;
