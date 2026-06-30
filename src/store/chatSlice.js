import { createSlice } from "@reduxjs/toolkit";

const loadApiKey = () => {
  try {
    return localStorage.getItem("siq_api_key") || "";
  } catch {
    return "";
  }
};

const loadJsonState = (key, defaultVal) => {
  try {
    const val = localStorage.getItem(key);
    if (val !== null) return JSON.parse(val);
    return defaultVal;
  } catch {
    return defaultVal;
  }
};

const saveJsonState = (key, val) => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Failed to save ${key}:`, e);
  }
};

const suggestSlice = createSlice({
  name: "suggest",
  initialState: {
    isOpen: false,
    apiUrl: "http://127.0.0.1:8000/suggest/generate",
    apiKey: loadApiKey(),
    input: loadJsonState("siq_input", ""),
    isLoading: false,
    suggestions: loadJsonState("siq_suggestions", []),
    selectedIndex: loadJsonState("siq_selected_index", -1),
    status: loadJsonState("siq_status", {
      dot: "idle",
      text: "Awaiting your prompt above to produce curated cards",
    }),
    modalItem: null,
  },
  reducers: {
    setInput(state, action) {
      state.input = action.payload;
      saveJsonState("siq_input", state.input);
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload;
      saveJsonState("siq_suggestions", state.suggestions);
    },
    selectSuggestion(state, action) {
      state.selectedIndex = action.payload;
      saveJsonState("siq_selected_index", state.selectedIndex);
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
      saveJsonState("siq_status", state.status);
    },
    setApiKey(state, action) {
      state.apiKey = action.payload;
      try {
        localStorage.setItem("siq_api_key", action.payload);
      } catch (e) {
        console.warn("Failed to save API key:", e);
      }
    },
    openModal(state, action) {
      state.modalItem = action.payload;
    },
    closeModal(state) {
      state.modalItem = null;
    },
    clearSuggestions(state) {
      state.suggestions = [];
      state.selectedIndex = -1;
      saveJsonState("siq_suggestions", state.suggestions);
      saveJsonState("siq_selected_index", state.selectedIndex);
    },
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    closeChat(state) {
      state.isOpen = false;
    },
    setConfig(state, action) {
      state.apiUrl = action.payload.apiUrl || state.apiUrl;
      state.apiKey = action.payload.apiKey || state.apiKey;
    },
  },
});

export const {
  setInput,
  setSuggestions,
  selectSuggestion,
  setIsLoading,
  setStatus,
  setApiKey,
  openModal,
  closeModal,
  clearSuggestions,
  toggleChat,
  closeChat,
  setConfig,
} = suggestSlice.actions;

export const selectIsOpen = (state) => state.suggest.isOpen;
export const selectInput = (state) => state.suggest.input;
export const selectSuggestions = (state) => state.suggest.suggestions;
export const selectSelectedIndex = (state) => state.suggest.selectedIndex;
export const selectIsLoading = (state) => state.suggest.isLoading;
export const selectStatus = (state) => state.suggest.status;
export const selectApiUrl = (state) => state.suggest.apiUrl;
export const selectApiKey = (state) => state.suggest.apiKey;
export const selectModalItem = (state) => state.suggest.modalItem;

export default suggestSlice.reducer;
