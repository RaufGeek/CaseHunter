import { useState, useEffect } from "react";
import InventoryItem from "@components/InventoryItem";
import ResultModal from "@components/ResultModal";
import Toast from "@components/Toast";
import PlusIcon from "../components/icons/PlusIcon";
import ArrowRightIcon from "../components/icons/ArrowRightIcon";
import { InventoryItem as InventoryItemType } from "@/types";

const UpgradePage: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<InventoryItemType | null>(
    null
  );
  const [desiredItem, setDesiredItem] = useState<InventoryItemType | null>(
    null
  );
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerType, setPickerType] = useState<string>("");
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeResult, setUpgradeResult] = useState<{
    isOpen: boolean;
    success: boolean;
    item: InventoryItemType | null;
  }>({ isOpen: false, success: false, item: null });
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [chance, setChance] = useState(0);
  const [multiplier, setMultiplier] = useState(0);

  const handleSlotClick = (type: string): void => {
    setPickerType(type);
    setShowPicker(true);
  };

  const handleItemSelect = (item: InventoryItemType): void => {
    if (pickerType === "inventory") {
      setSelectedItem(item);
    } else {
      setDesiredItem(item);
    }
    setShowPicker(false);
  };

  // Calculate upgrade chance and multiplier
  useEffect(() => {
    if (selectedItem && desiredItem) {
      const valueRatio = selectedItem.value / desiredItem.value;
      const calculatedChance = Math.min(Math.max(valueRatio * 100, 5), 95); // 5-95% range
      const calculatedMultiplier = Math.max(
        1,
        Math.floor(desiredItem.value / selectedItem.value)
      );

      setChance(Math.round(calculatedChance));
      setMultiplier(calculatedMultiplier);
    } else {
      setChance(0);
      setMultiplier(0);
    }
  }, [selectedItem, desiredItem]);

  const handleUpgrade = async () => {
    if (!selectedItem || !desiredItem || isUpgrading) return;

    setIsUpgrading(true);

    // Simulate upgrade process
    setTimeout(() => {
      const isSuccess = Math.random() * 100 < chance;

      setUpgradeResult({
        isOpen: true,
        success: isSuccess,
        item: isSuccess ? desiredItem : selectedItem,
      });

      setIsUpgrading(false);
    }, 3000);
  };

  const handleUpgradeResult = () => {
    if (upgradeResult.success) {
      setToast({ message: "Апгрейд успешен!", type: "success" });
    } else {
      setToast({ message: "Апгрейд не удался", type: "error" });
    }
    setUpgradeResult({ isOpen: false, success: false, item: null });
  };

  const mockInventoryItems: InventoryItemType[] = [
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
    {
      id: 4,
      name: "Golden Rose",
      value: 125.0,
      image: "https://casehunter.sbs/images/EternalRose.png",
    },
    {
      id: 5,
      name: "Vintage Cigar",
      value: 80.0,
      image: "https://casehunter.sbs/images/VintageCigar.png",
    },
    {
      id: 6,
      name: "Swiss Watch",
      value: 200.0,
      image: "https://casehunter.sbs/images/SwissWatch.png",
    },
  ];

  return (
    <div id="upgrade-page" className="page">
      <h2>Апгрейд</h2>

      <div className="content-card">
        <div id="upgrade-selection-area">
          <div
            className="upgrade-item-slot"
            id="selected-inventory-item-slot"
            data-type="inventory"
            onClick={() => handleSlotClick("inventory")}
          >
            {selectedItem ? (
              <div className="slot-item-display">
                <img src={selectedItem.image} alt="Selected Item" />
                <p className="slot-item-name">{selectedItem.name}</p>
                <p className="slot-item-value">{selectedItem.value} TON</p>
              </div>
            ) : (
              <div className="slot-placeholder">
                <PlusIcon className="plus-icon" />
                <span>Выберите ваш предмет</span>
              </div>
            )}
          </div>

          <div className="upgrade-arrow-connector">
            <ArrowRightIcon />
          </div>

          <div
            className="upgrade-item-slot"
            id="desired-upgrade-item-slot"
            data-type="desired"
            onClick={() => handleSlotClick("desired")}
          >
            {desiredItem ? (
              <div className="slot-item-display">
                <img src={desiredItem.image} alt="Desired Item" />
                <p className="slot-item-name">{desiredItem.name}</p>
                <p className="slot-item-value">{desiredItem.value} TON</p>
              </div>
            ) : (
              <div className="slot-placeholder">
                <PlusIcon className="plus-icon" />
                <span>Выберите желаемый NFT</span>
              </div>
            )}
          </div>
        </div>

        {showPicker && (
          <div id="upgrade-picker-container">
            <h4 id="upgrade-picker-title">Select Your Item</h4>
            <div id="upgrade-items-grid" className="inventory-grid">
              {mockInventoryItems.map((item) => (
                <InventoryItem
                  key={item.id}
                  item={item}
                  onSelect={handleItemSelect}
                />
              ))}
            </div>
            <button
              id="close-upgrade-picker-button"
              className="button button-secondary"
              onClick={() => setShowPicker(false)}
            >
              Close Picker
            </button>
          </div>
        )}

        <div id="upgrade-chance-display-container-new">
          <span id="upgrade-chance-text-left" className="chance-display-text">
            {chance}%
          </span>
          <div
            id="upgrade-chance-circle-new"
            style={{
              background: `conic-gradient(
                var(--primary-color) 0deg ${chance * 3.6}deg,
                var(--danger-color) ${chance * 3.6}deg 360deg
              )`,
            }}
          >
            <img
              src="https://casehunter.sbs/images/RestrictedGifts_AgADvhkAAkoFcFM.png?raw=true"
              alt="Upgrade Mascot"
              className="upgrade-mascot-image"
            />
            <div
              id="upgrade-chance-pointer-new"
              style={{
                transform: `translateX(-50%) rotate(${chance * 3.6}deg)`,
              }}
            ></div>
          </div>
          <span
            id="upgrade-multiplier-text-right"
            className="chance-display-text"
          >
            {multiplier}x
          </span>
        </div>

        <button
          id="do-upgrade-button"
          className="button"
          disabled={!selectedItem || !desiredItem || isUpgrading}
          onClick={handleUpgrade}
        >
          {isUpgrading
            ? "Апгрейд в процессе..."
            : !selectedItem || !desiredItem
            ? "Выберете предмет для апгрейда"
            : "Выполнить апгрейд"}
        </button>
      </div>

      {/* Upgrade Result Modal */}
      {upgradeResult.isOpen && upgradeResult.item && (
        <ResultModal
          isOpen={upgradeResult.isOpen}
          onClose={handleUpgradeResult}
          title={
            upgradeResult.success ? "Апгрейд успешен!" : "Апгрейд не удался"
          }
          image={upgradeResult.item.image}
          name={upgradeResult.item.name}
          subtitle={
            upgradeResult.success ? "Поздравляем!" : "Попробуйте еще раз"
          }
          onClaim={handleUpgradeResult}
        />
      )}

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

export default UpgradePage;
