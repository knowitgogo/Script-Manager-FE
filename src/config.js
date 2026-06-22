export function getChatbotConfig() {
  const script =
    document.currentScript ||
    document.querySelector('script[src*="chatbot.iife.js"]');

  let apiKey = script?.dataset.apiKey || null;
  if (!apiKey && script?.src) {
    const url = new URL(script.src, window.location.origin);
    const segments = url.pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1];
    if (lastSegment && !lastSegment.endsWith(".js")) {
      apiKey = lastSegment;
    }
  }

  // Always use the Laravel backend API endpoint
  // NOTE: data-api-url in HTML is for the widget loader script, NOT the chat API
  const baseUrl = "http://127.0.0.1:8000/user/chatbot/message";

  return { apiUrl: baseUrl, apiKey };
}
