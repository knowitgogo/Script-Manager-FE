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

  const baseUrl =
    script?.dataset.apiUrl ||
    script?.dataset.baseUrl ||
    "http://localhost:5000/chat";

  const cleanBaseUrl = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const bundleUrl = apiKey ? `${cleanBaseUrl}/${apiKey}` : cleanBaseUrl;

  const loader = document.createElement("script");
  loader.src = bundleUrl;
  loader.async = true;
  document.body.appendChild(loader);

  return { apiUrl: baseUrl, apiKey };
}
