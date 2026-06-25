import { useRef, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MessageInput.module.css";
import {
  selectInput,
  selectShowInput,
  selectLastUserMessage,
  selectLastBotResponse,
  setInput,
  setShowInput,
  removeLastMessages,
} from "../store/chatSlice";
export function MessageInput({ onKeyDown, onSend, onRegenerate }) {
  const dispatch = useDispatch();
  const input = useSelector(selectInput);
  const showInput = useSelector(selectShowInput);
  const lastUserMessage = useSelector(selectLastUserMessage);
  const lastBotResponse = useSelector(selectLastBotResponse);
  const inputRef = useRef(null);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Focus textarea when input is shown
  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showInput]);

  const startListening = useCallback(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn(
        "[Chatbot Widget] Speech recognition not supported in this browser",
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      dispatch(setInput(""));
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      dispatch(setInput(transcript));
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error("[Chatbot Widget] Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.start();
  }, [dispatch]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setIsListening(false);
  }, []);

  // Handle send with textarea
  const handleSend = () => {
    if (!input.trim()) return;
    onSend();
  };

  // Handle keypress in textarea
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
      return; // Don't call onKeyDown - already sent
    }
    onKeyDown?.(e);
  };

  // Quick action: Edit Previous Prompt
  const handleEditPrompt = () => {
    if (lastUserMessage) {
      // Remove the last messages from chat
      dispatch(removeLastMessages());
      // Show input with the previous message for editing
      dispatch(setInput(lastUserMessage));
      dispatch(setShowInput(true));
    }
  };

  // Quick action: Copy Last Response
  const handleCopyResponse = () => {
    if (lastBotResponse) {
      navigator.clipboard.writeText(lastBotResponse).then(() => {
        // Could show a toast here
        console.log("[Chatbot Widget] Response copied to clipboard");
      });
    }
  };

  return (
    <div
      className={styles.wrapper}
    >
      {showInput ? (
        // Input area (textarea)
        <div className={styles.inputArea}>
          <div className={styles.textareaWrapper}>
            <textarea
              ref={inputRef}
              className={styles.textarea}
              value={input}
              onChange={(e) => dispatch(setInput(e.target.value))}
              onKeyDown={handleKeyDown}
              placeholder={isListening ? "Listening..." : "Type here..."}
              rows={2}
            />
          </div>
          {/* Send button (outside textareaWrapper) */}
          <button
            className={styles.sendBtn}
            onClick={handleSend}
            type="button"
            disabled={!input.trim()}
          >
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      ) : (
        // Quick actions area (shown after sending)
        <div className={styles.quickActions}>
          <button
            className={styles.quickActionBtn}
            onClick={handleEditPrompt}
            type="button"
            disabled={!lastUserMessage}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>Edit</span>
          </button>
          <button
            className={styles.quickActionBtn}
            onClick={onRegenerate}
            type="button"
            disabled={!lastUserMessage}
          >
            <i className="fa-solid fa-rotate"></i>
            <span>Regenerate</span>
          </button>
          <button
            className={styles.quickActionBtn}
            onClick={handleCopyResponse}
            type="button"
            disabled={!lastBotResponse}
          >
            <i className="fa-solid fa-copy"></i>
            <span>Copy</span>
          </button>
          <button
            className={styles.backToInputBtn}
            onClick={() => dispatch(setShowInput(true))}
            type="button"
          >
            <i className="fa-solid fa-plus"></i>
            <span>New Message</span>
          </button>
        </div>
      )}
    </div>
  );
}
