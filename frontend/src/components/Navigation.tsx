import { NavLink } from "react-router-dom";
import HomeIcon from "./icons/HomeIcon";
import UpgradeIcon from "./icons/UpgradeIcon";
import ReferralsIcon from "./icons/ReferralsIcon";
import LeaderboardIcon from "./icons/LeaderboardIcon";
import ProfileIcon from "./icons/ProfileIcon";

const Navigation: React.FC = () => {
  const navItems = [
    {
      path: "/",
      label: "Games",
      icon: <HomeIcon />,
    },
    {
      path: "/upgrade",
      label: "Upgrade",
      icon: <UpgradeIcon />,
    },
    {
      path: "/referrals",
      label: "Referrals",
      icon: <ReferralsIcon />,
    },
    {
      path: "/leaderboard",
      label: "Leaders",
      icon: <LeaderboardIcon />,
    },
    {
      path: "/profile",
      label: "Profile",
      icon: <ProfileIcon />,
    },
  ];

  return (
    <nav id="app-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `nav-button ${isActive ? "active" : ""}`}
        >
          {item.icon}
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default Navigation;
