import { useState, useEffect } from "react";
import InventoryItem from "@components/InventoryItem";
import DepositModal from "@components/DepositModal";
import Toast from "@components/Toast";
import { UserData, InventoryItem as InventoryItemType } from "@/types";

const ProfilePage: React.FC = () => {
  const [userData, setUserData] = useState<UserData>({
    username: "User",
    userId: "#12345",
    balance: 1250,
    inventoryCount: 0,
  });

  const [inventory] = useState<InventoryItemType[]>([
    {
      id: 1,
      name: "Diamond Ring",
      value: 50.0,
      image: "https://casehunter.sbs/images/DiamondRing.png",
    },
    {
      id: 2,
      name: "Crystal Ball",
      value: 100.0,
      image: "https://casehunter.sbs/images/CrystalBall.png",
    },
    {
      id: 3,
      name: "Magic Potion",
      value: 75.0,
      image: "https://casehunter.sbs/images/MagicPotion.png",
    },
  ]);
  const [promocode, setPromocode] = useState<string>("");
  const [depositModal, setDepositModal] = useState<{
    isOpen: boolean;
    type: "ton" | "stars" | "gifts";
  }>({ isOpen: false, type: "stars" });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  useEffect(() => {
    // Simulate loading user data
    setUserData({
      username: "TestUser",
      userId: "#12345",
      balance: 1250,
      inventoryCount: 3,
    });
  }, []);

  const handleDepositStars = () => {
    setDepositModal({ isOpen: true, type: "stars" });
  };

  const handleDepositGifts = () => {
    setDepositModal({ isOpen: true, type: "gifts" });
  };

  const handleDeposit = (amount: number, type: string) => {
    console.log(`Deposit ${amount} ${type}`);
    setToast({
      message: `Депозит ${amount} ${type} обработан!`,
      type: "success",
    });
  };

  const handleRedeemPromocode = () => {
    // Handle promocode redemption
    console.log("Redeem promocode:", promocode);
  };

  const handleContactSupport = () => {
    // Handle support contact
    window.open("https://t.me/CaseHunterSupport", "_blank");
  };

  const sellAllItems = () => {
    // Handle sell all items
    console.log("Sell all items clicked");
  };

  return (
    <div id="profile-page" className="page">
      <div className="profile-header">
        <div id="profile-avatar" className="profile-avatar-placeholder">
          <span>{userData.username.charAt(0).toUpperCase()}</span>
        </div>
        <div className="profile-info">
          <div id="profile-username" className="username">
            {userData.username}
          </div>
          <div id="profile-userid" className="userid">
            {userData.userId}
          </div>
        </div>
      </div>

      <div className="content-card">
        <h3>Balance</h3>
        <div
          id="profile-balance-display"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
            alt="Star"
            className="balance-icon"
            style={{ width: "24px", height: "24px", marginRight: "8px" }}
          />
          <span
            style={{
              fontSize: "1.6em",
              fontWeight: "600",
              color: "var(--primary-color)",
            }}
          >
            {userData.balance}
          </span>
        </div>

        <input
          type="number"
          id="deposit-amount-input"
          placeholder="Сумма (минимум 50 звёзд)"
        />

        <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <button
            id="initiate-deposit-stars-button"
            className="button"
            style={{ flexGrow: 1 }}
            onClick={handleDepositStars}
          >
            Депозит Stars
          </button>
          <button
            id="initiate-deposit-ton-button"
            className="button button-secondary"
            style={{ flexGrow: 1, cursor: "not-allowed" }}
            disabled
          >
            Депозит TON &#x23F0;
          </button>
        </div>

        <div style={{ marginBottom: "15px" }}>
          <button
            id="initiate-deposit-gifts-button"
            className="button"
            onClick={handleDepositGifts}
          >
            Депозит Подарками
          </button>
        </div>
      </div>

      <div className="content-card">
        <h3>Promocode</h3>
        <div className="promocode-input-group">
          <input
            type="text"
            id="promocode-input"
            placeholder="Enter code"
            value={promocode}
            onChange={(e) => setPromocode(e.target.value)}
          />
          <button
            id="redeem-promocode-button"
            className="button button-secondary"
            onClick={handleRedeemPromocode}
          >
            Активировать
          </button>
        </div>
      </div>

      <div className="content-card">
        <h3>Support</h3>
        <p
          style={{
            color: "var(--text-secondary)",
            marginBottom: "15px",
            fontSize: "0.9em",
          }}
        >
          Have questions or need help? Contact our support team on Telegram.
        </p>
        <button
          id="support-button"
          className="button"
          onClick={handleContactSupport}
        >
          Contact Support
        </button>
      </div>

      <div className="content-card">
        <h3>My Collection ({userData.inventoryCount})</h3>
        <div id="inventory-grid" className="inventory-grid">
          {inventory.length > 0 ? (
            inventory.map((item) => (
              <InventoryItem
                key={item.id}
                item={item}
                onSell={() => console.log("Sell item:", item)}
              />
            ))
          ) : (
            <p
              id="empty-inventory-message"
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                color: "var(--text-placeholder)",
                padding: "15px 0",
              }}
            >
              Your collection is empty.
            </p>
          )}
        </div>

        {inventory.length > 0 && (
          <button
            id="sell-all-button"
            className="button"
            style={{ display: "block" }}
            onClick={sellAllItems}
          >
            Продать все за <span id="sell-all-value">0</span>{" "}
            <img
              src="https://casehunter.sbs/images/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
              alt="Star"
              className="balance-icon"
              style={{ width: "16px", height: "16px" }}
            />
          </button>
        )}
      </div>

      {/* Deposit Modal */}
      <DepositModal
        isOpen={depositModal.isOpen}
        onClose={() => setDepositModal({ isOpen: false, type: "stars" })}
        type={depositModal.type}
        onDeposit={handleDeposit}
      />

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ProfilePage;
