import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectMessages } from "../store/chatSlice";

const STORAGE_KEY = "chatbot_messages";

export function useChatPersistence() {
  const messages = useSelector(selectMessages);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to save chat history:", e);
    }
  }, [messages]);

  return { messages };
}
