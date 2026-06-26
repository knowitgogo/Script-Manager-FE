import { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setInput,
  setSuggestions,
  selectSuggestion,
  setIsLoading,
  setStatus,
  openModal,
  closeModal,
  clearSuggestions,
  selectInput,
  selectSuggestions,
  selectSelectedIndex,
  selectIsLoading,
  selectStatus,
  selectApiUrl,
  selectApiKey,
  selectModalItem,
} from "./store/chatSlice";
import { useTheme } from "./context/ThemeContext";
import { usePageContext } from "./context/PageContext";
import "./SuggestIQ.css";

const MAX_CHARS = 500;
const MODEL_NAME = "gpt-4o-mini";

function typeIcon(type) {
  const map = {
    hotel: "fa-hotel",
    restaurant: "fa-utensils",
    attraction: "fa-landmark",
    transport: "fa-car",
    shop: "fa-bag-shopping",
    health: "fa-heart-pulse",
  };
  return map[type] || "fa-lightbulb";
}

function isOnPage(suggestion, pageItems) {
  if (!pageItems.length) return false;
  const name = (suggestion.name || "").toLowerCase().trim();
  return pageItems.some(
    (p) => (p.name || "").toLowerCase().trim() === name,
  );
}

function highlightCardOnPage(suggestion) {
  document.querySelectorAll(".hotel-card.siq-highlighted").forEach((el) => {
    el.classList.remove("siq-highlighted");
  });
  if (!suggestion) return;
  const name = (suggestion.name || "").toLowerCase().trim();
  document.querySelectorAll(".hotel-card").forEach((card) => {
    const cardName = (card.querySelector(".hotel-name")?.textContent || "").toLowerCase().trim();
    if (cardName === name) {
      card.classList.add("siq-highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  });
}

const PRESETS = [
  { icon: "fa-lightbulb", label: "Creative Ideas" },
  { icon: "fa-code", label: "Code Solutions" },
  { icon: "fa-pen-fancy", label: "Writing" },
  { icon: "fa-brain", label: "Brainstorm" },
  { icon: "fa-chart-line", label: "Strategy" },
];

function StatusDot({ status }) {
  const cls =
    status === "idle"
      ? "siq-status-dot-idle"
      : status === "thinking"
        ? "siq-status-dot-thinking"
        : status === "done"
          ? "siq-status-dot-done"
          : "siq-status-dot-error";
  return (
    <span
      className={`siq-status-dot ${cls}${status === "thinking" ? " siq-pulse-dot" : ""}`}
    />
  );
}

function SuggestIQ() {
  const dispatch = useDispatch();
  const { theme, toggleTheme } = useTheme();
  const { items: pageItems, refreshPageContext } = usePageContext();

  const input = useSelector(selectInput);
  const suggestions = useSelector(selectSuggestions);
  const selectedIndex = useSelector(selectSelectedIndex);
  const isLoading = useSelector(selectIsLoading);
  const status = useSelector(selectStatus);
  const apiUrl = useSelector(selectApiUrl);
  const apiKey = useSelector(selectApiKey);
  const modalItem = useSelector(selectModalItem);

  const [copiedIndex, setCopiedIndex] = useState(-1);

  const onPageSet = useMemo(() => {
    const set = new Set();
    if (!pageItems.length) return set;
    suggestions.forEach((s) => {
      if (isOnPage(s, pageItems)) set.add(s.name);
    });
    return set;
  }, [suggestions, pageItems]);

  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  const handleInput = useCallback(
    (e) => dispatch(setInput(e.target.value)),
    [dispatch],
  );

  const fetchSuggestions = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || overLimit) return;

    dispatch(setIsLoading(true));
    dispatch(
      setStatus({ dot: "thinking", text: "Generating curated suggestions..." }),
    );
    dispatch(clearSuggestions());

    try {
      const freshPageContext = refreshPageContext();
      const headers = { "Content-Type": "application/json" };
      if (apiKey) headers["X-API-Key"] = apiKey;

      const payload = { query: trimmed, pageContext: freshPageContext };
      console.log("[SuggestIQ] Sending request:", { apiUrl, payload });

      const res = await axios.post(apiUrl,
        payload,
        { headers },
      );

      const data = res.data;
      console.log("[SuggestIQ] Response:", data);
      const items = Array.isArray(data) ? data : (data.suggestions ?? []);
      dispatch(setSuggestions(items));
      dispatch(
        setStatus({
          dot: "done",
          text: `Generated ${items.length} suggestion${items.length === 1 ? "" : "s"}`,
        }),
      );
    } catch (err) {
      console.error("[SuggestIQ] Request failed:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        headers: err.response?.headers,
      });
      const msg = err.response?.data?.error || err.message || "Request failed";
      dispatch(
        setStatus({
          dot: "error",
          text: `Error: ${msg}`,
        }),
      );
    } finally {
      dispatch(setIsLoading(false));
    }
  }, [input, overLimit, apiUrl, apiKey, refreshPageContext, dispatch]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        fetchSuggestions();
      }
    },
    [fetchSuggestions],
  );

  const handleRegenerate = useCallback(() => {
    fetchSuggestions();
  }, [fetchSuggestions]);

  const handleCopy = useCallback(
    (index) => {
      const item = suggestions[index];
      if (!item) return;
      const text = item.desc || item.name || JSON.stringify(item);
      navigator.clipboard.writeText(text).then(() => {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(-1), 2000);
      });
    },
    [suggestions],
  );

  const handleUse = useCallback(() => {
    const item = suggestions[selectedIndex];
    if (!item) return;
    dispatch(openModal(item));
  }, [suggestions, selectedIndex, dispatch]);

  const handleModalCopy = useCallback(() => {
    if (!modalItem) return;
    const text = modalItem.desc || modalItem.name || JSON.stringify(modalItem);
    navigator.clipboard.writeText(text);
  }, [modalItem]);

  const handlePreset = useCallback(
    (label) => {
      dispatch(setInput(label));
    },
    [dispatch],
  );

  const selected = selectedIndex >= 0 ? suggestions[selectedIndex] : null;

  useEffect(() => {
    const target = selected || modalItem;
    highlightCardOnPage(target || null);
    return () => highlightCardOnPage(null);
  }, [selected, modalItem]);

  return (
    <div id="suggestiq-root" data-theme={theme}>
      {/* Header */}
      <header className="siq-header-bar">
        <div className="siq-logo-area">
          <div className="siq-logo-icon">
            <i className="fas fa-lightbulb" />
          </div>
          <div>
            <h1 className="siq-title">SuggestIQ</h1>
            <p className="siq-subtitle">Curated Suggestions</p>
          </div>
        </div>
        <button
          className="siq-pill siq-flex siq-items-center siq-gap-2"
          onClick={toggleTheme}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
        >
          <i className={`fas fa-${theme === "dark" ? "sun" : "moon"}`} />
        </button>
      </header>

      {/* Main Card */}
      <div className="siq-card siq-w-full siq-max-w-2xl">
        {/* Status Bar */}
        <div className="siq-status-bar">
          <StatusDot status={status.dot} />
          <span className="siq-status-text">
            <span className="siq-status-text-highlight">Status:</span>{" "}
            {status.text}
          </span>
        </div>

        {/* Output Section */}
        <div className="siq-output-section">
          {/* Input */}
          <p className="siq-section-header">Input</p>
          <div className="siq-input-wrap siq-mb-4">
            <textarea
              className="siq-input siq-resize-none"
              rows={4}
              maxLength={MAX_CHARS + 100}
              placeholder="What kind of suggestions do you need?"
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <div className="siq-input-bar">
              <span
                className={`siq-char-count siq-text-xs siq-font-mono${
                  overLimit ? " siq-char-count-warn" : ""
                }`}
              >
                {charCount}/{MAX_CHARS}
              </span>
              <button
                className="siq-btn-accent"
                onClick={fetchSuggestions}
                disabled={isLoading || !input.trim() || overLimit}
              >
                {isLoading ? (
                  <>
                    <i className="fas fa-spinner fa-spin" />
                    Thinking...
                  </>
                ) : (
                  <>
                    <i className="fas fa-wand-magic-sparkles" />
                    Suggest
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Meta Bar */}
          <div className="siq-meta-bar">
            <span className="siq-meta-left">Suggestions</span>
            <div className="siq-meta-right">
              {suggestions.length > 0 && (
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
          ) : suggestions.length === 0 ? (
            <div className="siq-empty-state">
              <div className="siq-empty-icon">
                <i className="fas fa-wand-magic-sparkles" />
              </div>
              <span>
                {status.dot === "error"
                  ? "Something went wrong. Try again."
                  : "Your suggestions will appear here"}
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
                  onClick={() => dispatch(selectSuggestion(idx))}
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

          {/* Detail Panel */}
          {selected && (
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
                      <span className="siq-on-page-badge siq-on-page-badge-inline">On Page</span>
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
                  onClick={handleRegenerate}
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
                  onClick={() => handleCopy(selectedIndex)}
                >
                  <i
                    className={`fas fa-${copiedIndex === selectedIndex ? "check" : "copy"}`}
                  />
                  {copiedIndex === selectedIndex ? "Copied!" : "Copy"}
                </button>
                <div className="siq-action-spacer" />
                <button className="siq-btn-use" onClick={handleUse}>
                  <i className="fas fa-arrow-right" />
                  Use Suggestion
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Presets */}
      <div className="siq-footer-presets">
        <span className="siq-pill-label">Quick Start</span>
        {PRESETS.map((preset, idx) => (
          <button
            key={idx}
            className="siq-pill siq-transition-colors"
            onClick={() => handlePreset(preset.label)}
          >
            <i className={`fas ${preset.icon} siq-mr-1`} />
            {preset.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {modalItem && (
        <div
          className="siq-modal-overlay"
          onClick={() => dispatch(closeModal())}
        >
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
                    <span className="siq-on-page-badge siq-on-page-badge-inline">On Page</span>
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
                onClick={() => dispatch(closeModal())}
              >
                Dismiss
              </button>
              <button
                className="siq-modal-btn-copy siq-transition-colors"
                onClick={handleModalCopy}
              >
                <i className="fas fa-copy siq-mr-1" />
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SuggestIQ;
