import { useSelector, useDispatch } from "react-redux";
import styles from "./App.module.css";
import { ChatButton } from "./components/ChatButton";
import { ChatWindow } from "./components/ChatWindow";
import {
  selectIsOpen,
  selectMessages,
  toggleChat,
  clearHistory,
  setShowEmojiPicker,
} from "./store/chatSlice";
import { useChatApi } from "./hooks/useChatApi";
import { useChatPersistence } from "./hooks/useChatPersistence";
import { usePageContext } from "./hooks/usePageContext";
import { ThemeProvider } from "./context/ThemeContext";

function App() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
  const messages = useSelector(selectMessages);

  useChatPersistence();
  usePageContext(); // Capture page context once on mount
  const { sendMessage } = useChatApi();

  function handleSend(customText) {
    sendMessage(typeof customText === "string" ? customText : undefined);
    dispatch(setShowEmojiPicker(false));
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      dispatch(setShowEmojiPicker(false));
    }
  }

  return (
    <ThemeProvider>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.1/css/all.min.css"
        integrity="sha512-2SwdPD6INVrV/lHTZbO2nodKhrnDdJK9/kg2XD1r9uGqPo1cUbujc+IYdlYdEErWNu69gVcYgdxlmVmzTWnetw=="
        crossorigin="anonymous"
        referrerpolicy="no-referrer"
      />

      {/* Chat window — fixed above the button */}
      {isOpen && (
        <div className={styles.windowWrapper}>
          <ChatWindow
            messages={messages}
            onKeyDown={handleKeyDown}
            onSend={handleSend}
            onClear={() => dispatch(clearHistory())}
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
