import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
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

      console.log("User entered input:", messageText);

      dispatch(setIsLoading(true));
      try {
        const response = await axios.post(
          finalUrl,
          {
            message: messageText,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        console.log("Response status:", response.status);
        console.log("response", response.data);

        // Handle plain text response from Laravel
        const replyText =
          typeof response.data === "string"
            ? response.data
            : response.data?.reply || "No reply received.";

        dispatch(addMessage({ role: "bot", text: replyText }));
      } catch (error) {
        console.error("Chat API Error:", error);
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
