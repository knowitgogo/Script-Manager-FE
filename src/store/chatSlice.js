import { createSlice } from "@reduxjs/toolkit";

const loadApiKey = () => {
  try {
    return localStorage.getItem("siq_api_key") || "";
  } catch {
    return "";
  }
};

const suggestSlice = createSlice({
  name: "suggest",
  initialState: {
    isOpen: false,
    apiUrl: "http://127.0.0.1:8000/suggest/generate",
    apiKey: loadApiKey(),
    input: "",
    isLoading: false,
    suggestions: [],
    selectedIndex: -1,
    status: {
      dot: "idle",
      text: "Awaiting your prompt above to produce curated cards",
    },
    modalItem: null,
  },
  reducers: {
    setInput(state, action) {
      state.input = action.payload;
    },
    setSuggestions(state, action) {
      state.suggestions = action.payload;
    },
    selectSuggestion(state, action) {
      state.selectedIndex = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setStatus(state, action) {
      state.status = action.payload;
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
