import React, { useEffect } from "react";
import "../styles/components/ResultModal.scss";

interface ResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  name: string;
  subtitle?: string;
  onClaim: () => void;
  onSell?: () => void;
  showSellButton?: boolean;
}

const ResultModal: React.FC<ResultModalProps> = ({
  isOpen,
  onClose,
  title,
  image,
  name,
  subtitle,
  onClaim,
  onSell,
  showSellButton = false,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Add confetti effect
      const confetti = document.querySelector(".sr__confetti");
      if (confetti) {
        confetti.classList.add("active");
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="sr" style={{ display: isOpen ? "flex" : "none" }}>
      <div className="sr__backdrop" onClick={onClose}></div>
      <div
        className="sr__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sr-title"
      >
        <div className="sr__confetti" aria-hidden="true"></div>
        <h3 id="sr-title" className="sr__title">
          {title}
        </h3>
        <img id="sr-img" className="sr__img" src={image} alt={name} />
        <div id="sr-name" className="sr__name">
          {name}
        </div>
        {subtitle && (
          <div id="sr-sub" className="sr__sub">
            {subtitle}
          </div>
        )}
        <div className="sr__actions">
          <button id="sr-ok" className="sr__btn" onClick={onClaim}>
            Забрать
          </button>
          {showSellButton && onSell && (
            <button className="sr__btn sr__btn--secondary" onClick={onSell}>
              Продать все
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
