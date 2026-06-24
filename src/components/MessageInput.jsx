import { lazy, Suspense, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./MessageInput.module.css";
import {
  selectShowEmojiPicker,
  selectInput,
  setShowEmojiPicker,
  setInput,
} from "../store/chatSlice";
import { useTheme } from "../context/ThemeContext";

const EmojiPicker = lazy(() => import("emoji-picker-react"));

export function MessageInput({ onKeyDown, onSend }) {
  const dispatch = useDispatch();
  const showEmojiPicker = useSelector(selectShowEmojiPicker);
  const input = useSelector(selectInput);
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);

  // Speech recognition state
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  // Consume theme context to apply light mode styles
  const { theme } = useTheme();

  // Cleanup recognition on unmount
  useState(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startListening = useCallback(() => {
    // Check if browser supports SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn("[Chatbot Widget] Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      dispatch(setInput("")); // Clear any existing text
      console.log("[Chatbot Widget] Speech recognition started");
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      dispatch(setInput(transcript));
    };

    recognition.onend = () => {
      setIsListening(false);
      console.log("[Chatbot Widget] Speech recognition ended");
      // Note: We do NOT auto-send. User must click Send button.
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

  const handleEmojiClick = (emojiData) => {
    dispatch(setInput(input + emojiData.emoji));
    inputRef.current?.focus();
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    dispatch(setShowEmojiPicker(!showEmojiPicker));
  };

  const quickReplies = [
    "Efficient Hotel pricing",
    "Hotels in India",
    "Best Hotel on the current Page",
  ];

  return (
    <div
      className={`${styles.wrapper} ${theme === "light" ? styles.light : ""}`}
      ref={wrapperRef}
    >
      {/* Quick Reply Chips */}
      <div className={styles.chips}>
        {quickReplies.map((reply) => (
          <button
            key={reply}
            className={styles.chip}
            type="button"
            onClick={() => onSend(reply)}
          >
            {reply}
          </button>
        ))}
      </div>

      {/* Bottom row: [capsule: input + mic + emoji] [Send button] */}
      <div className={styles.bottomRow}>
        {/* Input capsule */}
        <div className={styles.inputCapsule}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            onKeyDown={onKeyDown}
            placeholder={isListening ? "Listening..." : "Type a message..."}
            readOnly={isListening}
          />
          
          {/* Mic button */}
          <button
            className={`${styles.micBtn} ${isListening ? styles.listening : ""}`}
            onClick={isListening ? stopListening : startListening}
            type="button"
            aria-label={isListening ? "Stop listening" : "Start voice input"}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            <i className={`fa-solid ${isListening ? "fa-stop" : "fa-microphone"}`}></i>
          </button>
          
          {/* Emoji button */}
          <button
            className={styles.emojiBtn}
            onClick={toggleEmojiPicker}
            type="button"
            aria-label="Toggle emoji picker"
          >
            <i className="fa-brands fa-fort-awesome"></i>
          </button>
        </div>

        {/* Send button — outside the capsule, never clipped */}
        <button
          className={styles.sendBtn}
          onClick={() => onSend()}
          type="button"
          disabled={!input.trim()}
        >
          <i className="fa-solid fa-paper-plane"></i>
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          className={styles.emojiPickerContainer}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              dispatch(setShowEmojiPicker(false));
            }
          }}
        >
          <Suspense
            fallback={
              <div className={styles.emojiPickerFallback}>Loading emojis…</div>
            }
          >
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              emojiStyle="native"
              width="100%"
              height={300}
              autoFocusSearch={false}
              searchPlaceholder="Search emojis…"
              skinTonesDisabled
              theme={theme === "light" ? "light" : "dark"}
            />
          </Suspense>
        </div>
      )}
    </div>
  );
}
