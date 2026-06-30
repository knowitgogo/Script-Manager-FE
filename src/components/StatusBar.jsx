function StatusDot({ status }) {
  const cls =
    status === "idle"
      ? "siq-status-dot-idle"
      : status === "thinking"
        ? "siq-status-dot-thinking"
        : status === "done"
          ? "siq-status-dot-done"
          : "siq-status-dot-error";
  return (
    <span
      className={`siq-status-dot ${cls}${status === "thinking" ? " siq-pulse-dot" : ""}`}
    />
  );
}

function StatusBar({ status }) {
  return (
    <div className="siq-status-bar">
      <StatusDot status={status.dot} />
      <span className="siq-status-text">
        <span className="siq-status-text-highlight">Status:</span>{" "}
        {status.text}
      </span>
    </div>
  );
}

export default StatusBar;
