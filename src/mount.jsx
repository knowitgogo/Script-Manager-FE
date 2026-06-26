import { getSuggestConfig } from "./config";
import SuggestIQWidget from "./SuggestIQWidget";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./store";
import { setConfig } from "./store/chatSlice";
import { ThemeProvider } from "./context/ThemeContext";
import { PageProvider } from "./context/PageContext";
import "./SuggestIQ.css";
import "./SuggestIQWidget.css";

function injectFont() {
  if (document.getElementById("siq-font")) return;
  const link = document.createElement("link");
  link.id = "siq-font";
  link.rel = "stylesheet";
  link.href =
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
  document.head.appendChild(link);
}

export function mountSuggestIQ() {
  if (window.__SUGGESTIQ_MOUNTED__) return;

  if (!document.body) {
    document.addEventListener("DOMContentLoaded", mountSuggestIQ, { once: true });
    return;
  }

  if (document.getElementById("siq-mount")) return;

  injectFont();

  const config = getSuggestConfig();
  store.dispatch(setConfig(config));

  const container = document.createElement("div");
  container.id = "siq-mount";
  document.body.appendChild(container);

  ReactDOM.createRoot(container).render(
    <Provider store={store}>
      <ThemeProvider>
        <PageProvider>
          <SuggestIQWidget />
        </PageProvider>
      </ThemeProvider>
    </Provider>,
  );
  window.__SUGGESTIQ_MOUNTED__ = true;
}
