import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectInput,
  selectApiUrl,
  selectApiKey,
  addMessage,
  setInput,
  setIsLoading,
} from "../store/chatSlice";

export function useChatApi() {
  const dispatch = useDispatch();
  const input = useSelector(selectInput);
  const apiUrl = useSelector(selectApiUrl);
  const apiKey = useSelector(selectApiKey);

  const sendMessage = useCallback(
    async (customText) => {
      const messageText = (
        typeof customText === "string" ? customText : input
      ).trim();
      if (!messageText) return;

      dispatch(addMessage({ role: "user", text: messageText }));

      // Only clear input box if not a quick-reply
      if (typeof customText !== "string") {
        dispatch(setInput(""));
      }

      const cleanUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const finalUrl = apiKey ? `${cleanUrl}/${apiKey}` : cleanUrl;

      dispatch(setIsLoading(true));
      try {
        const response = await fetch(finalUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: messageText }),
        });

        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const data = await response.json();
        dispatch(
          addMessage({ role: "bot", text: data.reply || "No reply received." }),
        );
      } catch {
        dispatch(
          addMessage({
            role: "bot",
            text: "Something went wrong. Please check the chatbot API URL.",
          }),
        );
      } finally {
        dispatch(setIsLoading(false));
      }
    },
    [dispatch, input, apiUrl, apiKey],
  );

  return { sendMessage };
}
