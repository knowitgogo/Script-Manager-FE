import { PRESETS } from "../utils/suggestIQHelpers";

function FooterPresets({ onPreset }) {
  return (
    <div className="siq-footer-presets">
      <span className="siq-pill-label">Quick Start</span>
      {PRESETS.map((preset, idx) => (
        <button
          key={idx}
          className="siq-pill siq-transition-colors"
          onClick={() => onPreset(preset.label)}
        >
          <i className={`fas ${preset.icon} siq-mr-1`} />
          {preset.label}
        </button>
      ))}
    </div>
  );
}

export default FooterPresets;
