import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface UserState {
  currentUser: User | null;
  // Separate states for different operations
  signin: {
    loading: boolean;
    error: string | null;
  };
  signup: {
    loading: boolean;
    error: string | null;
  };
}

const initialState: UserState = {
  currentUser: null,
  signin: {
    loading: false,
    error: null,
  },
  signup: {
    loading: false,
    error: null,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Sign In Actions
    signInStart: (state) => {
      state.signin.loading = true;
      state.signin.error = null;
    },
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.signin.loading = false;
      state.signin.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.signin.error = action.payload;
      state.signin.loading = false;
    },
    clearSignInError: (state) => {
      state.signin.error = null;
    },

    // Sign Up Actions
    signUpStart: (state) => {
      state.signup.loading = true;
      state.signup.error = null;
    },
    signUpSuccess: (state) => {
      state.signup.loading = false;
      state.signup.error = null;
    },
    signUpFailure: (state, action: PayloadAction<string>) => {
      state.signup.error = action.payload;
      state.signup.loading = false;
    },
    clearSignUpError: (state) => {
      state.signup.error = null;
    },

    // General Actions
    signOut: (state) => {
      state.currentUser = null;
      state.signin.loading = false;
      state.signin.error = null;
      state.signup.loading = false;
      state.signup.error = null;
    },
    clearAllErrors: (state) => {
      state.signin.error = null;
      state.signup.error = null;
    },
  },
});

export const {
  // Sign In
  signInStart,
  signInSuccess,
  signInFailure,
  clearSignInError,
  // Sign Up
  signUpStart,
  signUpSuccess,
  signUpFailure,
  clearSignUpError,
  // General
  signOut,
  clearAllErrors,
} = userSlice.actions;

export default userSlice.reducer;

// Selectors
export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectIsAuthenticated = (state: RootState) =>
  !!state.user.currentUser;

// Sign In Selectors
export const selectSignInLoading = (state: RootState) =>
  state.user.signin.loading;
export const selectSignInError = (state: RootState) => state.user.signin.error;

// Sign Up Selectors
export const selectSignUpLoading = (state: RootState) =>
  state.user.signup.loading;
export const selectSignUpError = (state: RootState) => state.user.signup.error;
