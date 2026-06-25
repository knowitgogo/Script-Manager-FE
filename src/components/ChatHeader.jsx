import styles from "./ChatHeader.module.css";
import { useTheme } from "../context/ThemeContext";

export function ChatHeader({ onClear, onResetSize }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.header}>
      <p className={styles.title}>Support</p>
      <div className={styles.actions}>
        {/* Reset window size to default button */}
        <button
          className={styles.resetSizeBtn}
          onClick={onResetSize}
          aria-label="Reset window size to default"
        >
          <i className="fa-solid fa-down-left-and-up-right-to-center"></i>
        </button>
        {/* Clear chat history button */}
        <button className={styles.clearBtn} onClick={onClear}>
          Clear
        </button>
        {/* Theme toggle button — switches between dark and light mode */}
        <button
          className={styles.themeToggle}
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <i
            className={`fa-solid ${theme === "dark" ? "fa-sun" : "fa-moon"}`}
          ></i>
        </button>
      </div>
    </div>
  );
}
