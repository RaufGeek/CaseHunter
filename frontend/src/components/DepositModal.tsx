import React, { useState, useEffect } from "react";
import "../styles/components/DepositModal.scss";
import InfoIcon from "./icons/InfoIcon";

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "ton" | "stars" | "gifts";
  onDeposit: (amount: number, type: string) => void;
}

interface GiftPrice {
  id: string;
  name: string;
  emoji: string;
  price: number;
  stars: number;
}

const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  type,
  onDeposit,
}) => {
  const [amount, setAmount] = useState(50);
  const [walletAddress, setWalletAddress] = useState("");
  const [comment, setComment] = useState("");
  const [giftPrices, setGiftPrices] = useState<GiftPrice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (type === "ton") {
        // Generate wallet address and comment
        setWalletAddress("UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        setComment(`deposit_${Date.now()}`);
      } else if (type === "gifts") {
        loadGiftPrices();
      }
    }
  }, [isOpen, type]);

  const loadGiftPrices = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      const prices: GiftPrice[] = [
        { id: "1", name: "Gift 1", emoji: "🎁", price: 10, stars: 50 },
        { id: "2", name: "Gift 2", emoji: "🎉", price: 25, stars: 100 },
        { id: "3", name: "Gift 3", emoji: "💎", price: 50, stars: 200 },
      ];
      setGiftPrices(prices);
    } catch (error) {
      console.error("Failed to load gift prices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeposit = () => {
    onDeposit(amount, type);
    onClose();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show toast notification
  };

  const openTonWallet = () => {
    const tonLink = `ton://transfer/${walletAddress}?amount=${
      amount * 1000000000
    }&text=${encodeURIComponent(comment)}`;
    window.open(tonLink, "_blank");
  };

  if (!isOpen) return null;

  return (
    <div className="modal active" id="deposit-instructions-modal">
      <div className="modal-content">
        <h3>
          {type === "ton" && "Deposit TON"}
          {type === "stars" && "Deposit Stars"}
          {type === "gifts" && "Депозит Подарками"}
        </h3>

        <div className="modal-body">
          {type === "ton" && (
            <>
              <p>
                To deposit, send the <strong>exact amount</strong> of TON to the
                address below. You <strong>MUST</strong> include the unique
                comment provided.
              </p>

              <div className="content-card">
                <h4>Wallet Address:</h4>
                <p id="deposit-wallet-address">{walletAddress}</p>
                <button
                  className="button button-secondary"
                  onClick={() => copyToClipboard(walletAddress)}
                >
                  Copy Address
                </button>
              </div>

              <div className="content-card">
                <h4>Required Comment:</h4>
                <p id="deposit-comment-text">{comment}</p>
                <button
                  className="button button-secondary"
                  onClick={() => copyToClipboard(comment)}
                >
                  Copy Comment
                </button>
              </div>

              <button className="button" onClick={openTonWallet}>
                <InfoIcon />
                Open Wallet & Pay
              </button>

              <p id="deposit-expiry-info">
                This deposit will expire in 15 minutes.
              </p>

              <div className="modal-actions">
                <button
                  className="button button-secondary"
                  onClick={() => {
                    /* Handle payment confirmation */
                  }}
                >
                  I Sent Funds
                </button>
                <button className="button button-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </>
          )}

          {type === "stars" && (
            <>
              <p>Enter the amount of stars you want to deposit:</p>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                placeholder="Amount (minimum 50 stars)"
                min="50"
              />
              <div className="modal-actions">
                <button className="button" onClick={handleDeposit}>
                  Deposit {amount} Stars
                </button>
                <button className="button button-secondary" onClick={onClose}>
                  Cancel
                </button>
              </div>
            </>
          )}

          {type === "gifts" && (
            <>
              <p>
                Переведите ваш подарок на аккаунт{" "}
                <a
                  href="https://t.me/SellerFrament"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "var(--primary-color)",
                    textDecoration: "none",
                  }}
                >
                  @SellerFrament
                </a>
                .
                <br />
                Актуальные цены:
              </p>

              <div id="gift-prices-list">
                {isLoading ? (
                  <div className="loader"></div>
                ) : (
                  giftPrices.map((gift) => (
                    <div key={gift.id} className="gift-price-item">
                      <span className="gift-emoji">{gift.emoji}</span>
                      <span className="gift-name">{gift.name}</span>
                      <span className="gift-stars">{gift.stars} ⭐</span>
                    </div>
                  ))
                )}
              </div>

              <div className="modal-actions">
                <button className="button button-secondary" onClick={onClose}>
                  Close
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DepositModal;
