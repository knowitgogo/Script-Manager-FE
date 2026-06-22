import { getChatbotConfig } from "./config";
import App from "./App";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { setConfig } from "./store/chatSlice";

function injectFont() {
  if (document.getElementById("montserrat-font")) return;
  const link = document.createElement("link");
  link.id = "montserrat-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

export function mountChatbot() {
  if (window.__TOKEN_MANAGER_CHATBOT_MOUNTED__) return;

  if (!document.body) {
    document.addEventListener("DOMContentLoaded", mountChatbot, { once: true });
    return;
  }

  if (document.getElementById("chatbot-root")) return;

  injectFont();

  const config = getChatbotConfig();
  store.dispatch(setConfig(config));

  const container = document.createElement("div");
  container.id = "chatbot-root";
  container.setAttribute("data-chatbot-mounted", "true");
  document.body.appendChild(container);

  ReactDOM.createRoot(container).render(
    <Provider store={store}>
      <App />
    </Provider>,
  );
  window.__TOKEN_MANAGER_CHATBOT_MOUNTED__ = true;
}
