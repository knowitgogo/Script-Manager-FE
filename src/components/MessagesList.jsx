import { useEffect, useRef, useState } from "react";
import styles from "./MessagesList.module.css";

export function MessagesList({ messages, loading }) {
  const bottomRef = useRef(null);
  const containerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    setIsAtBottom(true);
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const threshold = 100; // pixels from bottom to consider "at bottom"
      const isBottom = scrollTop + clientHeight >= scrollHeight - threshold;
      setIsAtBottom(isBottom);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
    setIsAtBottom(true);
  }, [messages]);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div
      className={styles.container}
      ref={containerRef}
    >
      {messages.map((msg, i) => {
        const isUser = msg.role === "user";

        return (
          <div
            key={i}
            className={`${styles.message} ${isUser ? styles.user : styles.bot}`}
          >
            {isUser ? (
              <>
                <div className={styles.bubble}>{msg.text}</div>
                <span className={styles.avatar}>
                  <i className="fa-regular fa-circle-user"></i>
                </span>
              </>
            ) : (
              <>
                <span className={styles.avatar}>
                  <i className="fa-brands fa-twitch"></i>
                </span>
                <div
                  className={styles.bubble}
                  dangerouslySetInnerHTML={{ __html: msg.text }}
                />
              </>
            )}
          </div>
        );
      })}
      {loading && (
        <div className={`${styles.message} ${styles.bot}`}>
          <span className={styles.avatar}>
            <i className="fa-brands fa-twitch"></i>
          </span>
          <div className={`${styles.bubble} ${styles.typingBubble}`}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      {!isAtBottom && (
        <button
          className={styles.scrollToBottomButton}
          onClick={scrollToBottom}
          aria-label="Scroll to latest messages"
        >
          <i className="fa-solid fa-arrow-down"></i>
        </button>
      )}
      <div ref={bottomRef}></div>
    </div>
  );
}
