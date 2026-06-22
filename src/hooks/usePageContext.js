import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPageContext,
  selectPageContext,
} from "../store/chatSlice";

function generateListingsHash(hotels) {
  // Generate a hash based on the actual listings content
  // This ensures context only changes when listings change
  const content = hotels
    .map(h => `${h.name}::${h.location}::${h.price}`)
    .join('|');
  
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

function extractHotelListings() {
  const hotels = [];
  
  // Find all hotel cards in the DOM
  const hotelCards = document.querySelectorAll('.hotel-card');
  
  hotelCards.forEach((card) => {
    try {
      // Extract hotel data from each card
      const name = card.querySelector('.hotel-name')?.innerText?.trim() || '';
      const location = card.querySelector('.hotel-location')?.innerText?.trim() || '';
      const rating = card.querySelector('.rating-value')?.innerText?.trim() || '';
      const reviewCount = card.querySelector('.review-count')?.innerText?.trim() || '';
      const price = card.querySelector('.hotel-price')?.innerText?.trim() || '';
      const description = card.querySelector('.hotel-description')?.innerText?.trim() || '';
      
      // Extract amenities
      const amenities = Array.from(card.querySelectorAll('.amenity-tag'))
        .map(tag => tag.innerText?.trim())
        .filter(Boolean);
      
      // Extract host name
      const hostName = card.querySelector('.host-info small')?.innerText?.trim() || '';
      
      if (name) {
        hotels.push({
          name,
          location,
          rating,
          reviewCount,
          price,
          description,
          amenities,
          hostName,
        });
      }
    } catch (e) {
      console.warn('Failed to extract hotel data from card:', e);
    }
  });
  
  return hotels;
}

function waitForHotelCards(maxAttempts = 20, interval = 300) {
  return new Promise((resolve) => {
    let attempts = 0;
    
    const check = () => {
      const cards = document.querySelectorAll('.hotel-card');
      attempts++;
      
      if (cards.length > 0 || attempts >= maxAttempts) {
        resolve(cards.length > 0);
        return;
      }
      
      setTimeout(check, interval);
    };
    
    check();
  });
}

async function capturePageContext(storedContext) {
  const url = window.location.href;
  const title = document.title || "";
  
  // Wait for hotel cards to be rendered
  const hasCards = await waitForHotelCards();
  
  if (hasCards) {
    console.log('[Chatbot Widget] Hotel cards found, extracting data...');
  } else {
    console.log('[Chatbot Widget] No hotel cards found after waiting');
  }
  
  // Extract hotel listings from the page
  const hotels = extractHotelListings();
  
  // Generate a content-based hash for this set of listings
  const listingsHash = generateListingsHash(hotels);
  
  // Check if this is the same listings as before
  if (storedContext && storedContext.listingsHash === listingsHash) {
    console.log('[Chatbot Widget] Same listings detected, keeping existing context');
    return null; // Signal that context hasn't changed
  }
  
  console.log('[Chatbot Widget] New listings detected, updating context');

  return {
    id: `${listingsHash}_${Date.now()}`,
    url,
    title,
    hotels,
    listingsHash, // Store the hash for future comparison
    capturedAt: new Date().toISOString(),
  };
}

export function usePageContext() {
  const dispatch = useDispatch();
  const storedContext = useSelector(selectPageContext);
  const hasCaptured = useRef(false);

  useEffect(() => {
    // Only capture once per mount to avoid re-capturing on re-renders
    if (hasCaptured.current) return;
    hasCaptured.current = true;

    // Async function to capture context
    const init = async () => {
      const context = await capturePageContext(storedContext);

      if (context === null) {
        // Context hasn't changed, keep existing
        console.log("[Chatbot Widget] Context unchanged, using existing context");
        return;
      }
      
      console.log("[Chatbot Widget] Capturing new page context:", context.url);
      console.log("[Chatbot Widget] Hotels found:", context.hotels.length);
      dispatch(setPageContext(context));
    };

    init();
  }, [dispatch, storedContext]);
}
