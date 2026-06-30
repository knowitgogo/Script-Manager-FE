import { useTheme } from "../context/ThemeContext";

function SuggestIQHeader() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="siq-header-bar">
      <div className="siq-logo-area">
        <div className="siq-logo-icon">
          <i className="fas fa-lightbulb" />
        </div>
        <div>
          <h1 className="siq-title">SuggestIQ</h1>
          <p className="siq-subtitle">Curated Suggestions</p>
        </div>
      </div>
      <button
        className="siq-pill siq-flex siq-items-center siq-gap-2"
        onClick={toggleTheme}
        title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      >
        <i className={`fas fa-${theme === "dark" ? "sun" : "moon"}`} />
      </button>
    </header>
  );
}

export default SuggestIQHeader;
