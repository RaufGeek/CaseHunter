import { InventoryItemProps } from "@/types";

const InventoryItem: React.FC<InventoryItemProps> = ({
  item,
  onSell,
  onSelect,
}) => {
  return (
    <div className="inventory-item">
      <div className="item-image-display">
        <img src={item.image} alt={item.name} />
      </div>
      <div className="inventory-item-name">{item.name}</div>
      <div className="inventory-item-value">{item.value} TON</div>
      <div className="inventory-item-actions">
        {onSelect && (
          <button className="button" onClick={() => onSelect(item)}>
            Select
          </button>
        )}
        {onSell && (
          <button
            className="button button-secondary"
            onClick={() => onSell(item)}
          >
            Sell
          </button>
        )}
      </div>
    </div>
  );
};

export default InventoryItem;
