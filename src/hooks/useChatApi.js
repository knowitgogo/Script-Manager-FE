import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  selectInput,
  selectApiUrl,
  selectApiKey,
  selectPageContext,
  selectLastUserMessage,
  addMessage,
  setInput,
  setIsLoading,
  setShowInput,
  removeLastMessages,
} from "../store/chatSlice";

export function useChatApi() {
  const dispatch = useDispatch();
  const input = useSelector(selectInput);
  const apiUrl = useSelector(selectApiUrl);
  const apiKey = useSelector(selectApiKey);
  const pageContext = useSelector(selectPageContext);
  const lastUserMessage = useSelector(selectLastUserMessage);
  
  // Track if a request is currently in flight to prevent double sends
  const isSending = useRef(false);

  const sendMessage = useCallback(
    async (customText) => {
      // Prevent duplicate sends
      if (isSending.current) {
        console.log("[Chatbot Widget] Ignoring duplicate send request");
        return;
      }
      
      const messageText = (
        typeof customText === "string" ? customText : input
      ).trim();
      if (!messageText) return;

      isSending.current = true;

      // Hide input after sending
      dispatch(setShowInput(false));

      dispatch(addMessage({ role: "user", text: messageText }));

      // Clear input box
      dispatch(setInput(""));

      const cleanUrl = apiUrl.endsWith("/") ? apiUrl.slice(0, -1) : apiUrl;
      const finalUrl = apiKey ? `${cleanUrl}/${apiKey}` : cleanUrl;

      console.log("User entered input:", messageText);
      console.log("Page context:", pageContext);

      dispatch(setIsLoading(true));
      try {
        const response = await axios.post(
          finalUrl,
          {
            message: messageText,
            pageContext: pageContext, // Include captured page context
            contextId: pageContext?.id, // Include context ID for backend reference
          },
          {
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          }
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
        isSending.current = false;
      }
    },
    [dispatch, input, apiUrl, apiKey, pageContext]
  );

  // Function to regenerate the last response
  const regenerateResponse = useCallback(() => {
    if (lastUserMessage) {
      // Remove the last messages from chat
      dispatch(removeLastMessages());
      // Resend the last user message to get a new response
      sendMessage(lastUserMessage);
    }
  }, [dispatch, lastUserMessage, sendMessage]);

  return { sendMessage, regenerateResponse };
}
