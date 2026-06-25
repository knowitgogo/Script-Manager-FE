import styles from "./ChatButton.module.css";

export function ChatButton({ isOpen, onClick }) {
  return (
    <button
      className={styles.button}
      onClick={onClick}
    >
      {isOpen ? (
        <i className="fa-solid fa-xmark"></i>
      ) : (
        <i className="fa-solid fa-headset"></i>
      )}
    </button>
  );
}
