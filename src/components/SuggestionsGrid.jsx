import { typeIcon, MODEL_NAME } from "../utils/suggestIQHelpers";

function SuggestionsGrid({
  suggestions,
  selectedIndex,
  isLoading,
  statusDot,
  onPageSet,
  onSelect,
}) {
  const isFakeEmpty =
    suggestions.length === 1 &&
    suggestions[0].name === "Hotels not available with this type of prompt";

  const showEmptyState = suggestions.length === 0 || isFakeEmpty;

  return (
    <>
      {/* Meta Bar */}
      <div className="siq-meta-bar">
        <span className="siq-meta-left">Suggestions</span>
        <div className="siq-meta-right">
          {suggestions.length > 0 && !isFakeEmpty && (
            <span className="siq-count-badge">{suggestions.length}</span>
          )}
          <span className="siq-model-badge">{MODEL_NAME}</span>
        </div>
      </div>

      {/* Chips Grid */}
      {isLoading && suggestions.length === 0 ? (
        <div className="siq-chips-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="siq-shimmer-block">
              <div className="siq-shimmer-icon" />
              <div className="siq-flex-1">
                <div className="siq-shimmer-line siq-w-full siq-mb-2" />
                <div className="siq-shimmer-line-sm" />
              </div>
            </div>
          ))}
        </div>
      ) : showEmptyState ? (
        <div className="siq-empty-state">
          <div className="siq-empty-icon">
            <i className={isFakeEmpty ? "fas fa-search-minus" : "fas fa-wand-magic-sparkles"} />
          </div>
          <span style={{ textAlign: "center" }}>
            {statusDot === "error" ? (
              "Something went wrong. Try again."
            ) : isFakeEmpty ? (
              <>
                <p style={{ margin: "0 0 8px", fontWeight: "600", color: "var(--siq-text)" }}>
                  {suggestions[0].name}
                </p>
                <p style={{ margin: 0, fontSize: "0.85em", opacity: 0.8 }}>
                  {suggestions[0].desc}
                </p>
              </>
            ) : statusDot === "done" && suggestions.length === 0 ? (
              "Hotels not available with this type of prompt."
            ) : (
              "Your suggestions will appear here"
            )}
          </span>
        </div>
      ) : (
        <div className="siq-chips-grid">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className={`siq-chip siq-transition-colors${
                selectedIndex === idx ? " siq-chip-selected" : ""
              }`}
              onClick={() => onSelect(idx)}
            >
              <div className="siq-chip-icon">
                <i className={`fas ${typeIcon(item.type)}`} />
              </div>
              <div className="siq-chip-text">
                <p className="siq-chip-name siq-truncate">
                  {item.name || `Suggestion ${idx + 1}`}
                </p>
                <p className="siq-chip-sub siq-truncate">
                  {item.sub || "Suggestion"}
                </p>
              </div>
              {onPageSet.has(item.name) && (
                <span className="siq-on-page-badge">On Page</span>
              )}
              {selectedIndex === idx && (
                <div className="siq-check-mark">
                  <i className="fas fa-check" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default SuggestionsGrid;
