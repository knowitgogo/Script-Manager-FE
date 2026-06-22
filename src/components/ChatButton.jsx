import styles from "./ChatButton.module.css";
import { useTheme } from "../context/ThemeContext";

export function ChatButton({ isOpen, onClick }) {
  const { theme } = useTheme();

  return (
    <button
      className={`${styles.button} ${theme === "light" ? styles.light : ""}`}
      onClick={onClick}
    >
      <i className="fa-solid fa-headset"></i>
    </button>
  );
}
