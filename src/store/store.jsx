import { configureStore } from "@reduxjs/toolkit";

// Simple dummy reducer since we removed auth
const dummyReducer = (state = {}, action) => {
  return state;
};

// Simple store without authentication - no persistence needed
export const store = configureStore({
  reducer: {
    dummy: dummyReducer, // Add a dummy reducer to prevent empty reducer object
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: ['persist/PERSIST'],
    },
  })
});