import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleChat,
  closeChat,
  selectIsOpen,
} from "./store/chatSlice";
import { useTheme } from "./context/ThemeContext";
import SuggestIQ from "./SuggestIQ";
import "./SuggestIQWidget.css";

function SuggestIQWidget() {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsOpen);
  const { theme, toggleTheme } = useTheme();

  const handleToggle = useCallback(() => dispatch(toggleChat()), [dispatch]);
  const handleClose = useCallback(() => dispatch(closeChat()), [dispatch]);

  return (
    <div className="siq-widget" data-theme={theme}>
      {/* Window */}
      {isOpen && (
        <div className="siq-widget-window">
          <div className="siq-widget-header">
            <div className="siq-widget-header-left">
              <div className="siq-widget-header-icon">
                <i className="fas fa-lightbulb" />
              </div>
              <span className="siq-widget-header-title">SuggestIQ</span>
            </div>
            <div className="siq-widget-header-actions">
              <button
                className="siq-widget-header-btn"
                onClick={toggleTheme}
                title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
              >
                <i className={`fas fa-${theme === "dark" ? "sun" : "moon"}`} />
              </button>
              <button
                className="siq-widget-header-btn"
                onClick={handleClose}
                title="Close"
              >
                <i className="fas fa-times" />
              </button>
            </div>
          </div>
          <div className="siq-widget-body">
            <SuggestIQ />
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="siq-widget-btn"
        onClick={handleToggle}
        title={isOpen ? "Close" : "Open SuggestIQ"}
      >
        <i className={`fas ${isOpen ? "fa-times" : "fa-lightbulb"}`} />
      </button>
    </div>
  );
}

export default SuggestIQWidget;
