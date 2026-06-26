import { configureStore } from "@reduxjs/toolkit";
import suggestReducer from "./chatSlice";

export const store = configureStore({
  reducer: {
    suggest: suggestReducer,
  },
});

export default store;
