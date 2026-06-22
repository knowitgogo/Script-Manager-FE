import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./ChatWindow.module.css";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";
import { selectIsLoading } from "../store/chatSlice";

const STORAGE_KEY = "chatWindowSize";
const DEFAULT_SIZE = { width: 360, height: 540 };

export function ChatWindow({ messages, onKeyDown, onSend, onClear }) {
  const isLoading = useSelector(selectIsLoading);
  const [size, setSize] = useState(DEFAULT_SIZE);

  // Load saved size from localStorage on component mount
  useEffect(() => {
    const savedSize = localStorage.getItem(STORAGE_KEY);
    if (savedSize) {
      try {
        const parsedSize = JSON.parse(savedSize);
        setSize(parsedSize);
      } catch (error) {
        console.error("Failed to parse saved size:", error);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  const initResize = (e, direction) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = size.width;
    const startHeight = size.height;

    const doResize = (ev) => {
      let newWidth = startWidth;
      let newHeight = startHeight;
      if (direction.includes("w"))
        newWidth = startWidth + (startX - ev.clientX);
      if (direction.includes("n"))
        newHeight = startHeight + (startY - ev.clientY);
      const resizedSize = {
        width: Math.max(320, Math.min(800, newWidth)),
        height: Math.max(380, Math.min(900, newHeight)),
      };
      setSize(resizedSize);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resizedSize));
    };

    const stopResize = () => {
      window.removeEventListener("mousemove", doResize);
      window.removeEventListener("mouseup", stopResize);
    };

    window.addEventListener("mousemove", doResize);
    window.addEventListener("mouseup", stopResize);
  };

  const resetSize = () => {
    const newSize = DEFAULT_SIZE;
    setSize(newSize);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSize));
  };

  return (
    <div
      className={styles.outer}
      style={{ width: size.width, height: size.height }}
    >
      {/* Resize handles – outside the clipped inner */}
      <div
        className={styles.resizeHandleL}
        onMouseDown={(e) => initResize(e, "w")}
      />
      <div
        className={styles.resizeHandleT}
        onMouseDown={(e) => initResize(e, "n")}
      />
      <div
        className={styles.resizeHandleTL}
        onMouseDown={(e) => initResize(e, "nw")}
      />

      {/* Clipped inner panel */}
      <div className={styles.inner}>
        <ChatHeader onClear={onClear} onResetSize={resetSize} />
        <MessagesList messages={messages} loading={isLoading} />
        <MessageInput onKeyDown={onKeyDown} onSend={onSend} />
      </div>
    </div>
  );
}
