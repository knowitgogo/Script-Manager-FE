import { typeIcon } from "../utils/suggestIQHelpers";

function SuggestionModal({ modalItem, onPageSet, onClose, onCopy }) {
  if (!modalItem) return null;

  return (
    <div className="siq-modal-overlay" onClick={onClose}>
      <div className="siq-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="siq-modal-header">
          <div className="siq-modal-icon-box">
            <i className={`fas ${typeIcon(modalItem.type)}`} />
          </div>
          <div>
            <h3 className="siq-modal-title">
              {modalItem.name || "Suggestion"}
            </h3>
            <p className="siq-modal-sub">
              {modalItem.sub || ""}
              {onPageSet.has(modalItem.name) && (
                <span className="siq-on-page-badge siq-on-page-badge-inline">
                  On Page
                </span>
              )}
            </p>
          </div>
        </div>
        <div className="siq-modal-desc-box">
          {modalItem.desc || "No description available."}
        </div>
        <div className="siq-modal-actions">
          <button
            className="siq-modal-btn-dismiss siq-transition-colors"
            onClick={onClose}
          >
            Dismiss
          </button>
          <button
            className="siq-modal-btn-copy siq-transition-colors"
            onClick={onCopy}
          >
            <i className="fas fa-copy siq-mr-1" />
            Copy to Clipboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuggestionModal;
