import React from "react";
import CaseCard from "@components/CaseCard";
import { CasesModalProps, Case } from "@/types";

const CasesModal: React.FC<CasesModalProps> = ({ isOpen, onClose, cases }) => {
  if (!isOpen) return null;

  const handleCaseClick = (caseItem: Case) => {
    console.log("Opening case:", caseItem);
    // Здесь будет логика открытия кейса
  };

  return (
    <div id="cases-modal" className="modal open">
      <div className="modal-backdrop" onClick={onClose}></div>
      <div className="modal-dialog">
        <div className="modal-header">
          <h2 id="cases-modal-title">Кейсы</h2>
          <button className="modal-close" type="button" onClick={onClose}>
            ✕
          </button>
        </div>
        <div id="cases-modal-body" className="modal-body">
          <div className="cases-grid">
            {cases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                caseItem={caseItem}
                onClick={handleCaseClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CasesModal;
