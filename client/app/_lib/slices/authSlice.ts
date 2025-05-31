import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  userSignup,
  userLogin,
  userForgotPassword,
  userResetPassword,
  userResetPasswordPing,
} from "../actions/authAction";
import Cookies from "js-cookie";

// Define interfaces for better type safety
export interface User {
  _id?: string;
  name?: string;
  email?: string;
  bio?: string;
  role?: string;
  isEmailVerified?: boolean;
  isBanned?: boolean;
  isPremiumUser?: boolean;
  organization?: string;
}

interface AuthState {
  loading: boolean;
  userInfo: User | null;
  error: string | null;
  success: boolean;
  message: string | null;
  isAuthenticated: boolean; // New property to track auth status
}

export const getLocalStorage = () => {
  if (typeof window !== "undefined") {
    return window.localStorage;
  }
  return null;
};

const gettingUserInfo = (): User | null => {
  if (typeof window === "undefined") return null;
  try {
    const userInfo = getLocalStorage()?.getItem("userInfo");
    if (!userInfo) return null;
    return JSON.parse(userInfo);
  } catch (error) {
    console.log(error);
    getLocalStorage()?.clear();
    return null;
  }
};

const initialState: AuthState = {
  loading: false,
  userInfo: gettingUserInfo(),
  error: null,
  success: false,
  message: null,
  isAuthenticated: !!gettingUserInfo(), // Initialize based on userInfo
};

// Helper function to handle pending state
const handlePending = (state: AuthState) => {
  state.loading = true;
  state.error = null;
  state.success = false;
  state.message = null;
};

// Helper function to handle rejection
const handleRejection = (state: AuthState, action: any) => {
  state.loading = false;
  state.error = action.payload || "An error occurred";
  state.success = false;
  state.message = null;
};

const authSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      state.loading = false;
      state.userInfo = null;
      state.error = null;
      state.isAuthenticated = false;
      state.success = false;
      state.message = null;
      getLocalStorage()?.clear();
      Cookies.remove("token");
    },
    setCredentials: (
      state,
      { payload }: PayloadAction<{ user: User | null }>,
    ) => {
      state.userInfo = payload.user;
      state.isAuthenticated = !!payload.user;

      if (!payload.user) {
        getLocalStorage()?.removeItem("userInfo");
      } else {
        getLocalStorage()?.setItem("userInfo", JSON.stringify(payload.user));
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(userLogin.pending, handlePending)
      .addCase(
        userLogin.fulfilled,
        (state, { payload }: { payload: { user: User; message: string } }) => {
          getLocalStorage()?.setItem("userInfo", JSON.stringify(payload.user));
          state.loading = false;
          state.error = null;
          state.success = true;
          state.message = payload.message;
          state.isAuthenticated = true;
          state.userInfo = payload.user;
        },
      )
      .addCase(userLogin.rejected, handleRejection);

    // Signup
    builder
      .addCase(userSignup.pending, handlePending)
      .addCase(
        userSignup.fulfilled,
        (state, { payload }: { payload: { user: User; message: string } }) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.message = payload.message;
        },
      )
      .addCase(userSignup.rejected, handleRejection);

    // Forgot Password
    builder
      .addCase(userForgotPassword.pending, handlePending)
      .addCase(
        userForgotPassword.fulfilled,
        (state, { payload }: { payload: { message: string } }) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.message = payload.message;
        },
      )
      .addCase(userForgotPassword.rejected, handleRejection);

    // Reset Password
    builder
      .addCase(userResetPassword.pending, handlePending)
      .addCase(
        userResetPassword.fulfilled,
        (state, { payload }: { payload: { message: string } }) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.message = payload.message;
        },
      )
      .addCase(userResetPassword.rejected, handleRejection);

    // Reset Password Ping
    builder
      .addCase(userResetPasswordPing.pending, handlePending)
      .addCase(
        userResetPasswordPing.fulfilled,
        (state, { payload }: { payload: { message: string } }) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          state.message = payload.message;
        },
      )
      .addCase(userResetPasswordPing.rejected, handleRejection);
  },
});

export const { logout, setCredentials, clearError, clearSuccess } =
  authSlice.actions;

export default authSlice.reducer;
