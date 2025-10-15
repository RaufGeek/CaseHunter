import React, { useState, useEffect, useRef } from "react";
import "../styles/components/RouletteModal.scss";

interface RouletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseName: string;
  balance: number;
  onSpin: (multiplier: number) => void;
}

interface RouletteItem {
  id: string;
  name: string;
  image: string;
  value: number;
  rarity: "common" | "rare" | "epic" | "legendary";
}

const RouletteModal: React.FC<RouletteModalProps> = ({
  isOpen,
  onClose,
  caseName,
  balance,
  onSpin,
}) => {
  const [multiplier, setMultiplier] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [possiblePrizes, setPossiblePrizes] = useState<RouletteItem[]>([]);

  const reel1Ref = useRef<HTMLDivElement>(null);
  const reel2Ref = useRef<HTMLDivElement>(null);
  const reel3Ref = useRef<HTMLDivElement>(null);

  const samplePrizes: RouletteItem[] = [
    {
      id: "1",
      name: "Star",
      image:
        "https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png",
      value: 10,
      rarity: "common",
    },
    {
      id: "2",
      name: "Gift",
      image:
        "https://casehunter.sbs/images/gifts_emoji_by_gifts_changes_bot_AgAD-IYAAsfWsEk.png",
      value: 50,
      rarity: "rare",
    },
    {
      id: "3",
      name: "Diamond",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250907_222256007.png",
      value: 100,
      rarity: "epic",
    },
    {
      id: "4",
      name: "Gold",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250831_184845312.png",
      value: 200,
      rarity: "legendary",
    },
    {
      id: "5",
      name: "Premium",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000116933.png",
      value: 500,
      rarity: "legendary",
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setPossiblePrizes(samplePrizes);
      initializeReels();
    }
  }, [isOpen]);

  const initializeReels = () => {
    // Initialize reels with items
    [reel1Ref, reel2Ref, reel3Ref].forEach((reelRef) => {
      if (reelRef.current) {
        reelRef.current.innerHTML = "";

        // Create multiple copies of items for smooth scrolling
        const items = [...samplePrizes, ...samplePrizes, ...samplePrizes];

        items.forEach((item) => {
          const itemElement = document.createElement("div");
          itemElement.className = "roulette-item";
          itemElement.innerHTML = `
            <img src="${item.image}" alt="${item.name}" />
          `;
          reelRef.current?.appendChild(itemElement);
        });
      }
    });
  };

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);
    onSpin(multiplier);

    // Animate reels
    [reel1Ref, reel2Ref, reel3Ref].forEach((reelRef) => {
      if (reelRef.current) {
        const randomOffset = Math.random() * 1000;
        const baseRotation = 360 * 3; // 3 full rotations
        const finalRotation = baseRotation + randomOffset;

        reelRef.current.style.transform = `translateY(-${finalRotation}px)`;
        reelRef.current.style.transition =
          "transform 3s cubic-bezier(0.25, 0.1, 0.25, 1)";
      }
    });

    // Reset spinning state after animation
    setTimeout(() => {
      setIsSpinning(false);
    }, 3000);
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" id="roulette-modal">
      <div className="modal-content">
        <div className="modal-header">
          <h3 id="roulette-case-name">{caseName}</h3>
          <div id="roulette-modal-balance-display">
            <div className="balance-label">Balance</div>
            <div className="balance-value-line">
              <span id="roulette-modal-balance-value">{balance}</span>
              <img
                src="https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
                alt="Star"
                className="balance-icon"
              />
            </div>
          </div>
        </div>

        <div id="roulette-wheel-container">
          <div
            className="roulette-individual-reel-row-visual active"
            id="roulette-reel-1"
          >
            <div className="roulette-spinner-reel" ref={reel1Ref}></div>
          </div>
          <div
            className="roulette-individual-reel-row-visual active"
            id="roulette-reel-2"
          >
            <div className="roulette-spinner-reel" ref={reel2Ref}></div>
          </div>
          <div
            className="roulette-individual-reel-row-visual active"
            id="roulette-reel-3"
          >
            <div className="roulette-spinner-reel" ref={reel3Ref}></div>
          </div>
        </div>

        <div className="case-multiplier-selector">
          <button
            className={`button button-secondary ${
              multiplier === 1 ? "active-multiplier" : ""
            }`}
            onClick={() => setMultiplier(1)}
          >
            1x
          </button>
          <button
            className={`button button-secondary ${
              multiplier === 2 ? "active-multiplier" : ""
            }`}
            onClick={() => setMultiplier(2)}
          >
            2x
          </button>
          <button
            className={`button button-secondary ${
              multiplier === 3 ? "active-multiplier" : ""
            }`}
            onClick={() => setMultiplier(3)}
          >
            3x
          </button>
        </div>

        <div className="modal-actions">
          <button
            id="spin-button"
            className="button"
            onClick={handleSpin}
            disabled={isSpinning}
          >
            {isSpinning ? "Spinning..." : "Spin"}
          </button>
          <button
            id="close-roulette-button"
            className="button button-secondary"
            onClick={handleClose}
          >
            Close
          </button>
        </div>

        <hr />
        <h4>Possible Prizes in this Case:</h4>
        <div id="possible-prizes-display">
          {possiblePrizes.map((prize) => (
            <div key={prize.id} className="prize-card">
              <div className="prize-card-image-placeholder">
                <img src={prize.image} alt={prize.name} />
              </div>
              <div className="prize-card-name">{prize.name}</div>
              <div className="prize-card-price">{prize.value}⭐</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouletteModal;
