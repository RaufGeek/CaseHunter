import React, { useState, useEffect, useRef } from "react";
import "../styles/components/FortuneWheel.scss";
import CloseIcon from "./icons/CloseIcon";

interface FortuneWheelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WheelItem {
  id: string;
  name: string;
  image: string;
  value: number;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ isOpen, onClose }) => {
  const [currentPrice, setCurrentPrice] = useState(30);
  const [isSpinning, setIsSpinning] = useState(false);
  const [, setSelectedItem] = useState<WheelItem | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);

  const wheelItems: WheelItem[] = [
    {
      id: "1",
      name: "Star",
      image:
        "https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png",
      value: 10,
    },
    {
      id: "2",
      name: "Gift",
      image:
        "https://casehunter.sbs/images/gifts_emoji_by_gifts_changes_bot_AgAD-IYAAsfWsEk.png",
      value: 50,
    },
    {
      id: "3",
      name: "Diamond",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250907_222256007.png",
      value: 100,
    },
    {
      id: "4",
      name: "Gold",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250831_184845312.png",
      value: 200,
    },
    {
      id: "5",
      name: "Premium",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000116933.png",
      value: 500,
    },
    {
      id: "6",
      name: "Legendary",
      image:
        "https://casehunter.sbs/images/BackgroundEraser_20250908_000155281.png",
      value: 1000,
    },
  ];

  const handleSpin = () => {
    if (isSpinning) return;

    setIsSpinning(true);

    // Random selection
    const randomIndex = Math.floor(Math.random() * wheelItems.length);
    const selected = wheelItems[randomIndex];

    // Calculate rotation
    const baseRotation = 360 * 5; // 5 full rotations
    const itemAngle = 360 / wheelItems.length;
    const targetAngle = randomIndex * itemAngle;
    const finalRotation = baseRotation + (360 - targetAngle);

    if (wheelRef.current) {
      wheelRef.current.style.transform = `rotate(${finalRotation}deg)`;
    }

    // Set result after animation
    setTimeout(() => {
      setSelectedItem(selected);
      setIsSpinning(false);
    }, 4200);
  };

  const handlePriceChange = (direction: "increase" | "decrease") => {
    if (direction === "increase") {
      setCurrentPrice((prev) => Math.min(prev + 10, 100));
    } else {
      setCurrentPrice((prev) => Math.max(prev - 10, 10));
    }
  };

  const handleClose = () => {
    if (!isSpinning) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen && iconsRef.current) {
      // Create wheel segments
      iconsRef.current.innerHTML = "";
      wheelItems.forEach((item, index) => {
        const segment = document.createElement("div");
        segment.className = "seg-icon";
        segment.style.transform = `rotate(${
          index * (360 / wheelItems.length)
        }deg)`;

        const img = document.createElement("img");
        img.src = item.image;
        img.alt = item.name;
        segment.appendChild(img);

        iconsRef.current?.appendChild(segment);
      });
    }
  }, [isOpen, wheelItems]);

  if (!isOpen) return null;

  return (
    <div className="modal open" id="fortune-modal">
      <div className="modal-backdrop" onClick={handleClose}></div>
      <div className="modal-dialog">
        <div className="modal-header">
          <h2>РУЛЕТКА</h2>
          <button className="modal-close" onClick={handleClose}>
            <CloseIcon />
          </button>
        </div>
        <div className="modal-body">
          <section className="fortune-section content-card">
            <div className="wheel-wrap">
              <div className="pointer"></div>
              <div className="wheel" id="fortune-wheel" ref={wheelRef}>
                <div className="icons" ref={iconsRef}></div>
              </div>
              <div className="wheel-center">Ожидание</div>
            </div>

            <div className="fortune-slider">
              <button
                className="btn minus"
                onClick={() => handlePriceChange("decrease")}
                disabled={currentPrice <= 10}
              >
                —
              </button>
              <div className="price">
                {currentPrice} Roll за ⭐{currentPrice}
              </div>
              <button
                className="btn plus"
                onClick={() => handlePriceChange("increase")}
                disabled={currentPrice >= 100}
              >
                +
              </button>
            </div>

            <div className="fortune-actions">
              <button
                className="cta"
                onClick={handleSpin}
                disabled={isSpinning}
              >
                {isSpinning
                  ? "Крутим..."
                  : `${currentPrice} Roll за ⭐${currentPrice}`}
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FortuneWheel;
