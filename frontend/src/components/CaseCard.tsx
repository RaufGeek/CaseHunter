import { CaseCardProps } from "@/types";

const CaseCard: React.FC<CaseCardProps> = ({ caseItem, onClick }) => {
  return (
    <div className="case-card" onClick={() => onClick?.(caseItem)}>
      <div className="case-image-display">
        <img src={caseItem.image} alt={caseItem.name} />
      </div>
      <div className="case-name">{caseItem.name}</div>
      <div className="case-price">
        <img
          src="https://images.casehunter.sbs/DMJTGStarsEmoji_AgADZxIAAjoUmVI.png"
          alt="Star"
          className="balance-icon"
        />
        {caseItem.price}
      </div>
    </div>
  );
};

export default CaseCard;
