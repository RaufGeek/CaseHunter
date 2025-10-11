import { NavLink } from "react-router-dom";

const Navigation: React.FC = () => {
  const navItems = [
    {
      path: "/",
      label: "Games",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </svg>
      ),
    },
    {
      path: "/upgrade",
      label: "Upgrade",
      icon: (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1"
        >
          <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
          <path d="M7.41 11.41L12 6.83l4.59 4.58L18 10l-6-6-6 6z" />
          <path d="M7.41 7.41L12 2.83l4.59 4.58L18 6l-6-6-6 6z" />
        </svg>
      ),
    },
    {
      path: "/referrals",
      label: "Referrals",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
      ),
    },
    {
      path: "/leaderboard",
      label: "Leaders",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M16,1H4C2.89,1 2,1.89 2,3V17H4V3H16V1M16.5,5H7.5C6.67,5 6,5.67 6,6.5V22.5L12,19.5L18,22.5V6.5C18,5.67 17.33,5 16.5,5M14,11H10V9H14V11M14,15H10V13H14V15Z" />
        </svg>
      ),
    },
    {
      path: "/profile",
      label: "Profile",
      icon: (
        <svg viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
        </svg>
      ),
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
