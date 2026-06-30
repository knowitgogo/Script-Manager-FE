import { MAX_CHARS } from "../utils/suggestIQHelpers";

function SuggestInput({
  input,
  isLoading,
  onInputChange,
  onKeyDown,
  onSubmit,
}) {
  const charCount = input.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <>
      <p className="siq-section-header">Input</p>
      <div className="siq-input-wrap siq-mb-4">
        <textarea
          className="siq-input siq-resize-none"
          rows={4}
          maxLength={MAX_CHARS + 100}
          placeholder="What kind of suggestions do you need?"
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
          disabled={isLoading}
        />
        <div className="siq-input-bar">
          <span
            className={`siq-char-count siq-text-xs siq-font-mono${
              overLimit ? " siq-char-count-warn" : ""
            }`}
          >
            {charCount}/{MAX_CHARS}
          </span>
          <button
            className="siq-btn-accent"
            onClick={onSubmit}
            disabled={isLoading || !input.trim() || overLimit}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin" />
                Thinking...
              </>
            ) : (
              <>
                <i className="fas fa-wand-magic-sparkles" />
                Suggest
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

export default SuggestInput;
