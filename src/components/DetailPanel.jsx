import { typeIcon } from "../utils/suggestIQHelpers";

function DetailPanel({
  selected,
  selectedIndex,
  copiedIndex,
  isLoading,
  onPageSet,
  onRegenerate,
  onCopy,
}) {
  if (!selected) return null;

  return (
    <div className="siq-detail-panel siq-animate-fade-in">
      <div className="siq-detail-header">
        <div className="siq-detail-icon-box">
          <i className={`fas ${typeIcon(selected.type)}`} />
        </div>
        <div>
          <h3 className="siq-detail-name">
            {selected.name || "Suggestion"}
          </h3>
          <p className="siq-detail-sub">
            {selected.sub || ""}
            {onPageSet.has(selected.name) && (
              <span className="siq-on-page-badge siq-on-page-badge-inline">
                On Page
              </span>
            )}
          </p>
        </div>
      </div>
      <p className="siq-detail-desc">
        {selected.desc || "No description available."}
      </p>
      <div className="siq-detail-bg-icon">
        <i className={`fas ${typeIcon(selected.type)}`} />
      </div>

      {/* Action Footer */}
      <div className="siq-action-footer">
        <button
          className="siq-action-btn siq-action-btn-regenerate siq-transition-colors"
          onClick={onRegenerate}
          disabled={isLoading}
        >
          <i className="fas fa-rotate" />
          Regenerate
        </button>
        <button
          className={`siq-action-btn siq-transition-colors${
            copiedIndex === selectedIndex
              ? " siq-action-btn-copy-done"
              : " siq-action-btn-copy"
          }`}
          onClick={() => onCopy(selectedIndex)}
        >
          <i
            className={`fas fa-${copiedIndex === selectedIndex ? "check" : "copy"}`}
          />
          {copiedIndex === selectedIndex ? "Copied!" : "Copy"}
        </button>

      </div>
    </div>
  );
}

export default DetailPanel;
