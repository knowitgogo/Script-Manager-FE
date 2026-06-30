import { useState, useCallback, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  setInput,
  setSuggestions,
  selectSuggestion,
  setIsLoading,
  setStatus,

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
import {
  MAX_CHARS,
  isOnPage,
  highlightCardOnPage,
} from "./utils/suggestIQHelpers";

import SuggestIQHeader from "./components/SuggestIQHeader";
import StatusBar from "./components/StatusBar";
import SuggestInput from "./components/SuggestInput";
import SuggestionsGrid from "./components/SuggestionsGrid";
import DetailPanel from "./components/DetailPanel";
import SuggestionModal from "./components/SuggestionModal";
import FooterPresets from "./components/FooterPresets";
import "./SuggestIQ.css";

function SuggestIQ() {
  const dispatch = useDispatch();
  const { theme } = useTheme();
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

  const overLimit = input.length > MAX_CHARS;

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

      const res = await axios.post(apiUrl, payload, { headers });

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



  const handleModalCopy = useCallback(() => {
    if (!modalItem) return;
    const text = modalItem.desc || modalItem.name || JSON.stringify(modalItem);
    navigator.clipboard.writeText(text);
  }, [modalItem]);

  const handleModalClose = useCallback(() => {
    dispatch(closeModal());
  }, [dispatch]);

  const handlePreset = useCallback(
    (label) => {
      dispatch(setInput(label));
    },
    [dispatch],
  );

  const handleSelect = useCallback(
    (idx) => {
      dispatch(selectSuggestion(idx));
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
      <SuggestIQHeader />

      <div className="siq-card siq-w-full siq-max-w-2xl">
        <StatusBar status={status} />

        <div className="siq-output-section">
          <SuggestInput
            input={input}
            isLoading={isLoading}
            onInputChange={handleInput}
            onKeyDown={handleKeyDown}
            onSubmit={fetchSuggestions}
          />

          <SuggestionsGrid
            suggestions={suggestions}
            selectedIndex={selectedIndex}
            isLoading={isLoading}
            statusDot={status.dot}
            onPageSet={onPageSet}
            onSelect={handleSelect}
          />

          <DetailPanel
            selected={selected}
            selectedIndex={selectedIndex}
            copiedIndex={copiedIndex}
            isLoading={isLoading}
            onPageSet={onPageSet}
            onRegenerate={handleRegenerate}
            onCopy={handleCopy}

          />
        </div>
      </div>

      <FooterPresets onPreset={handlePreset} />

      <SuggestionModal
        modalItem={modalItem}
        onPageSet={onPageSet}
        onClose={handleModalClose}
        onCopy={handleModalCopy}
      />
    </div>
  );
}

export default SuggestIQ;
