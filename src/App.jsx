import { useSelector, useDispatch } from "react-redux";
import styles from "./App.module.css";
import { ChatButton } from "./components/ChatButton";
import { ChatWindow } from "./components/ChatWindow";
import {
  selectIsOpen,
  selectMessages,
  toggleChat,
  clearHistory,
} from "./store/chatSlice";
import { useChatApi } from "./hooks/useChatApi";
import { useChatPersistence } from "./hooks/useChatPersistence";
import { usePageContext } from "./hooks/usePageContext";
import { ThemeProvider } from "./context/ThemeContext";
import "@fortawesome/fontawesome-free/css/all.min.css";

function App() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
  const messages = useSelector(selectMessages);

  useChatPersistence();
  usePageContext(); // Capture page context once on mount
  const { sendMessage, regenerateResponse } = useChatApi();

  function handleSend(customText) {
    sendMessage(typeof customText === "string" ? customText : undefined);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <ThemeProvider>
      {/* Chat window — fixed above the button */}
      {isOpen && (
        <div className={styles.windowWrapper}>
          <ChatWindow
            messages={messages}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
            onClear={() => dispatch(clearHistory())}
            onRegenerate={regenerateResponse}
          />
        </div>
      )}

      {/* Toggle button — fixed independently at bottom-right */}
      <div className={styles.btnWrapper}>
        <ChatButton isOpen={isOpen} onClick={() => dispatch(toggleChat())} />
      </div>
    </ThemeProvider>
  );
}

export default App;
