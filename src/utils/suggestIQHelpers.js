export const MAX_CHARS = 500;
export const MODEL_NAME = "meta-llama/llama-4-scout-17b-16e-instruct";

export const PRESETS = [
  { icon: "fa-lightbulb", label: "Creative Ideas" },
  { icon: "fa-code", label: "Code Solutions" },
  { icon: "fa-pen-fancy", label: "Writing" },
  { icon: "fa-brain", label: "Brainstorm" },
  { icon: "fa-chart-line", label: "Strategy" },
];

export function typeIcon(type) {
  const map = {
    hotel: "fa-hotel",
    restaurant: "fa-utensils",
    attraction: "fa-landmark",
    transport: "fa-car",
    shop: "fa-bag-shopping",
    health: "fa-heart-pulse",
  };
  return map[type] || "fa-lightbulb";
}

export function isOnPage(suggestion, pageItems) {
  if (!pageItems.length) return false;
  const name = (suggestion.name || "").toLowerCase().trim();
  return pageItems.some((p) => (p.name || "").toLowerCase().trim() === name);
}

export function highlightCardOnPage(suggestion) {
  // Clear all highlights first
  document.querySelectorAll(".hotel-card.siq-highlighted").forEach((el) => {
    el.classList.remove("siq-highlighted");
  });

  if (!suggestion) return;

  // Try ID-based match first (fast and exact)
  if (suggestion.id !== null && suggestion.id !== undefined) {
    const cards = document.querySelectorAll(".hotel-card");
    const card = cards[suggestion.id];
    if (card) {
      card.classList.add("siq-highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
  }

  // Fallback: name-based match (in case id is missing)
  const name = (suggestion.name || "").toLowerCase().trim();
  document.querySelectorAll(".hotel-card").forEach((card) => {
    const cardName = (card.querySelector(".hotel-name")?.textContent || "")
      .toLowerCase()
      .trim();

    if (cardName === name) {
      card.classList.add("siq-highlighted");
      card.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });
}
