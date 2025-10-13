import { useState, useEffect } from "react";

const Header: React.FC = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Simulate loading balance
    setBalance(1250);
  }, []);

  return (
    <header id="app-header">
      <div className="app-title-container">
        <img
          src="https://casehunter.sbs/images/BackgroundEraser_20250831_184845312.png"
          alt="Case Hunter Logo"
          className="app-logo"
        />
        <div className="app-title">Case Hunter</div>
      </div>

      <div className="wallet-info">
        <div id="balance">
          <img
            src="https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
            alt="Star"
            className="balance-icon"
          />
          <span id="star-balance">{balance}</span>
        </div>
        <div id="header-avatar" className="header-avatar-placeholder">
          <span>U</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
