import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./styles/App.scss";

// Telegram WebApp types
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void;
        expand: () => void;
        close: () => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
        };
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
        };
      };
    };
    gtag?: (...args: any[]) => void;
  }
}

// Components
import LoadingScreen from "@components/LoadingScreen";
import Header from "@components/Header";
import Navigation from "@components/Navigation";

// Pages
import HomePage from "@pages/HomePage";
import UpgradePage from "@pages/UpgradePage";
import ReferralsPage from "@pages/ReferralsPage";
import LeaderboardPage from "@pages/LeaderboardPage";
import ProfilePage from "@pages/ProfilePage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize Telegram WebApp
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.ready();
      window.Telegram.WebApp.expand();
    }

    // Initialize Google Analytics
    if (window.gtag) {
      window.gtag("config", "G-MSDGWEGLR0");
    }

    // Simulate loading user data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <div id="app-container">
        <Header />

        <main id="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/referrals" element={<ReferralsPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </main>

        <Navigation />
      </div>
    </Router>
  );
}

export default App;
