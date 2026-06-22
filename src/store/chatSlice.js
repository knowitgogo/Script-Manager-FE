import { createSlice } from "@reduxjs/toolkit";

const loadMessages = () => {
  try {
    const saved = localStorage.getItem("chatbot_messages");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: loadMessages(),
    input: "",
    isOpen: false,
    showEmojiPicker: false,
    apiUrl: "http://127.0.0.1:8000/user/chatbot/message ",
    apiKey: null,
    isLoading: false,
  },
  reducers: {
    addMessage(state, action) {
      state.messages.push(action.payload);
    },
    setInput(state, action) {
      state.input = action.payload;
    },
    toggleChat(state) {
      state.isOpen = !state.isOpen;
    },
    setShowEmojiPicker(state, action) {
      state.showEmojiPicker = action.payload;
    },
    setConfig(state, action) {
      state.apiUrl = action.payload.apiUrl || state.apiUrl;
      state.apiKey = action.payload.apiKey || state.apiKey;
    },
    clearHistory(state) {
      state.messages = [];
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
  },
});

export const {
  addMessage,
  setInput,
  toggleChat,
  setShowEmojiPicker,
  setConfig,
  clearHistory,
  setIsLoading,
} = chatSlice.actions;

export const selectMessages = (state) => state.chat.messages;
export const selectInput = (state) => state.chat.input;
export const selectIsOpen = (state) => state.chat.isOpen;
export const selectShowEmojiPicker = (state) => state.chat.showEmojiPicker;
export const selectApiUrl = (state) => state.chat.apiUrl;
export const selectApiKey = (state) => state.chat.apiKey;
export const selectIsLoading = (state) => state.chat.isLoading;

export default chatSlice.reducer;
