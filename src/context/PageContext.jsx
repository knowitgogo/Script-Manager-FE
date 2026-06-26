/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useCallback } from "react";

const PageContext = createContext([]);

export function collectPageItems() {
  let items;
  try {
    const data = window.__SIQ_PAGE_DATA;
    if (Array.isArray(data) && data.length) return data;
    const script = document.querySelector('script[type="application/ld+json"]');
    if (script) {
      const parsed = JSON.parse(script.textContent);
      items = parsed?.itemListElement || parsed?.["@graph"] || parsed;
      if (Array.isArray(items) && items.length) return items;
    }
  } catch { /* ignore */ }

  try {
    const cards = document.querySelectorAll(".hotel-card");
    if (cards.length) {
      return Array.from(cards).map((card) => ({
        name: card.querySelector(".hotel-name")?.textContent?.trim() || "",
        location: card.querySelector(".hotel-location")?.textContent?.replace("📍", "").trim() || "",
        rating: card.querySelector(".rating-value")?.textContent?.trim() || "",
        price: card.querySelector(".hotel-price")?.textContent?.trim() || "",
        description: card.querySelector(".hotel-description")?.textContent?.trim() || "",
        amenities: Array.from(card.querySelectorAll(".amenity-tag")).map((e) => e.textContent.trim()),
        superhost: !!card.querySelector(".superhost-indicator"),
      }));
    }
  } catch { /* ignore */ }

  return [];
}

export function PageProvider({ children }) {
  const [items, setItems] = useState(() => collectPageItems());

  const refreshPageContext = useCallback(() => {
    const fresh = collectPageItems();
    console.log("[SuggestIQ] Page context refreshed:", fresh);
    setItems(fresh);
    return fresh;
  }, []);

  return (
    <PageContext.Provider value={{ items, refreshPageContext }}>
      {children}
    </PageContext.Provider>
  );
}

export function usePageContext() {
  return useContext(PageContext);
}
