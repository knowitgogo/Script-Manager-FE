import { lazy, Suspense, useRef, useEffect } from "react";
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

  // Consume theme context to apply light mode styles
  const { theme } = useTheme();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        dispatch(setShowEmojiPicker(false));
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEmojiClick = (emojiData) => {
    dispatch(setInput(input + emojiData.emoji));
    inputRef.current?.focus();
  };

  const toggleEmojiPicker = (e) => {
    e.stopPropagation();
    dispatch(setShowEmojiPicker(!showEmojiPicker));
  };

  const quickReplies = ["What is Web3?", "Pricing", "FAQs"];

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

      {/* Bottom row: [capsule: input + emoji] [Send button] */}
      <div className={styles.bottomRow}>
        {/* Input capsule */}
        <div className={styles.inputCapsule}>
          <input
            ref={inputRef}
            className={styles.input}
            value={input}
            onChange={(e) => dispatch(setInput(e.target.value))}
            onKeyDown={onKeyDown}
            placeholder="Type a message..."
          />
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
              emojiStyle="google"
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
