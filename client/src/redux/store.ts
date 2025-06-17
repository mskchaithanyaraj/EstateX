import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./user/userSlice"; // Import your user reducer

export const store = configureStore({
  reducer: { user: userReducer }, // Add your reducers here
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for non-serializable data
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
