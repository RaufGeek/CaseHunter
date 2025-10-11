import { useState } from "react";
import InventoryItem from "@components/InventoryItem";
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

  const mockInventoryItems: InventoryItemType[] = [
    {
      id: 1,
      name: "Diamond Ring",
      value: 50.0,
      image: "https://images.casehunter.sbs/DiamondRing.png",
    },
    {
      id: 2,
      name: "Crystal Ball",
      value: 100.0,
      image: "https://images.casehunter.sbs/CrystalBall.png",
    },
    {
      id: 3,
      name: "Magic Potion",
      value: 75.0,
      image: "https://images.casehunter.sbs/MagicPotion.png",
    },
    {
      id: 4,
      name: "Golden Rose",
      value: 125.0,
      image: "https://images.casehunter.sbs/EternalRose.png",
    },
    {
      id: 5,
      name: "Vintage Cigar",
      value: 80.0,
      image: "https://images.casehunter.sbs/VintageCigar.png",
    },
    {
      id: 6,
      name: "Swiss Watch",
      value: 200.0,
      image: "https://images.casehunter.sbs/SwissWatch.png",
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
                <svg className="plus-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                  />
                </svg>
                <span>Выберите ваш предмет</span>
              </div>
            )}
          </div>

          <div className="upgrade-arrow-connector">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M4,15V9H12V4.16L19.84,12L12,19.84V15H4Z" />
            </svg>
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
                <svg className="plus-icon" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z"
                  />
                </svg>
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
            0%
          </span>
          <div id="upgrade-chance-circle-new">
            <img
              src="https://images.casehunter.sbs/RestrictedGifts_AgADvhkAAkoFcFM.png?raw=true"
              alt="Upgrade Mascot"
              className="upgrade-mascot-image"
            />
            <div id="upgrade-chance-pointer-new"></div>
          </div>
          <span
            id="upgrade-multiplier-text-right"
            className="chance-display-text"
          >
            0x
          </span>
        </div>

        <button
          id="do-upgrade-button"
          className="button"
          disabled={!selectedItem || !desiredItem}
        >
          {!selectedItem || !desiredItem
            ? "Выберете предмет для апгрейда"
            : "Выполнить апгрейд"}
        </button>
      </div>
    </div>
  );
};

export default UpgradePage;
