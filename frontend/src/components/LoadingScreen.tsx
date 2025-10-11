import { useState, useEffect } from "react";

const LoadingScreen: React.FC = () => {
  const [loadingStatus, setLoadingStatus] = useState("Loading user data...");

  useEffect(() => {
    const statusMessages = [
      "Loading user data...",
      "Connecting to server...",
      "Loading game data...",
      "Almost ready...",
    ];

    let currentIndex = 0;
    const interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % statusMessages.length;
      setLoadingStatus(statusMessages[currentIndex]);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div id="loading-screen">
      <img
        src="https://images.casehunter.sbs/BackgroundEraser_20250831_184845312.png"
        alt="Case Hunter Logo"
        className="loading-logo"
      />
      <div className="loading-title">CASE HUNTER</div>
      <div className="loader"></div>
      <p id="loading-status" className="loading-status-text">
        {loadingStatus}
      </p>
      <div className="channel-link-container">
        <a
          href="https://t.me/CaseHunterNews"
          target="_blank"
          rel="noopener noreferrer"
        >
          @casehunter
        </a>
      </div>
    </div>
  );
};

export default LoadingScreen;
