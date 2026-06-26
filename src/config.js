export function getSuggestConfig() {
  const script =
    document.currentScript ||
    document.querySelector('script[src*="chatbot.iife.js"], script[src*="suggestiq.iife.js"]');

  let apiKey = script?.dataset.apiKey || null;
  if (!apiKey && script?.src) {
    const url = new URL(script.src, window.location.origin);
    const segments = url.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && !lastSegment.endsWith(".js")) {
      apiKey = lastSegment;
    }
  }

  const baseUrl = script?.dataset.apiUrl || "http://127.0.0.1:8000/suggest/generate";

  return { apiUrl: baseUrl, apiKey };
}
