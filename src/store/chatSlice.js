import { createSlice } from "@reduxjs/toolkit";

const loadMessages = () => {
  try {
    const saved = localStorage.getItem("chatbot_messages");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const loadPageContext = () => {
  try {
    const saved = localStorage.getItem("chatbot_page_context");
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: loadMessages(),
    input: "",
    isOpen: false,
    apiUrl: "http://127.0.0.1:8000/user/chatbot/message",
    apiKey: null,
    isLoading: false,
    pageContext: loadPageContext(),
    pageContextId: loadPageContext()?.id || null,
    showInput: true, // Whether to show the input area
    lastUserMessage: null, // Store last user message for edit/regenerate
    lastBotResponse: null, // Store last bot response for copy
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
      
      // Track last user and bot messages
      if (action.payload.role === "user") {
        state.lastUserMessage = action.payload.text;
      } else if (action.payload.role === "bot") {
        state.lastBotResponse = action.payload.text;
      }
    },
    setInput(state, action) {
      state.input = action.payload;
    },
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    setConfig(state, action) {
      state.apiUrl = action.payload.apiUrl || state.apiUrl;
      state.apiKey = action.payload.apiKey || state.apiKey;
    },
    clearHistory(state) {
      state.messages = [];
      state.lastUserMessage = null;
      state.lastBotResponse = null;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setShowInput(state, action) {
      state.showInput = action.payload;
    },
    setPageContext(state, action) {
      state.pageContext = action.payload;
      state.pageContextId = action.payload?.id || null;
      // Persist to localStorage
      try {
        localStorage.setItem(
          "chatbot_page_context",
          JSON.stringify(action.payload)
        );
      } catch (e) {
        console.warn("Failed to save page context:", e);
      }
    },
    clearPageContext(state) {
      state.pageContext = null;
      state.pageContextId = null;
      try {
        localStorage.removeItem("chatbot_page_context");
      } catch (e) {
        console.warn("Failed to clear page context:", e);
      }
    },
  },
});

export const {
  addMessage,
  setInput,
  toggleChat,
  setConfig,
  clearHistory,
  setIsLoading,
  setShowInput,
  setPageContext,
  clearPageContext,
} = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;
export const selectInput = (state) => state.chat.input;
export const selectIsOpen = (state) => state.chat.isOpen;
export const selectApiUrl = (state) => state.chat.apiUrl;
export const selectApiKey = (state) => state.chat.apiKey;
export const selectIsLoading = (state) => state.chat.isLoading;
export const selectShowInput = (state) => state.chat.showInput;
export const selectLastUserMessage = (state) => state.chat.lastUserMessage;
export const selectLastBotResponse = (state) => state.chat.lastBotResponse;
export const selectPageContext = (state) => state.chat.pageContext;
export const selectPageContextId = (state) => state.chat.pageContextId;

export default chatSlice.reducer;
