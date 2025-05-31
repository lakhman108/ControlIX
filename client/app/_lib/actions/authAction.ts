import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const backendURL = process.env["NEXT_PUBLIC_BACKEND_URL"];

// Add interfaces for request payloads
interface LoginCredentials {
  email: string;
  password: string;
}

interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

interface ForgotPasswordCredentials {
  email: string;
}

interface ResetPasswordCredentials {
  newPassword: string;
  rePassword: string;
  token: string;
  email: string;
  time: string;
}

interface ResetPasswordPingCredentials {
  token: string;
  email: string;
  time: string;
}

// Add at the top with other interfaces
interface ApiError {
  response?: {
    data: {
      error: string;
    };
  };
  message: string;
}

export const userLogin = createAsyncThunk(
  "user/login",
  async ({ email, password }: LoginCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const user = { email, password };
      const { data } = await axios.post(
        `${backendURL}user/login`,
        {
          user,
        },
        config,
      );
      return data;
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue(err.message);
      }
    }
  },
);

export const userSignup = createAsyncThunk(
  "user/signup",
  async ({ name, email, password }: SignupCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const user = { name, email, password };
      const { data } = await axios.post(
        `${backendURL}user/signup`,
        { user },
        config,
      );
      return data;
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue(err.message);
      }
    }
  },
);

export const userForgotPassword = createAsyncThunk(
  "user/forgot_password",
  async ({ email }: ForgotPasswordCredentials, { rejectWithValue }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };
      const user = { email };
      const { data } = await axios.post(
        `${backendURL}user/forgot_password`,
        { user },
        config,
      );
      return data;
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue(err.message);
      }
    }
  },
);

export const userResetPassword = createAsyncThunk(
  "user/forgot_password_reset",
  async (
    { newPassword, rePassword, token, email, time }: ResetPasswordCredentials,
    { rejectWithValue },
  ) => {
    try {
      if (newPassword != rePassword) {
        return rejectWithValue("Both password much match");
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };
        const user = { password: newPassword, token, email, time };
        const { data } = await axios.post(
          `${backendURL}user/forgot_password_reset`,
          { user },
          config,
        );
        return data;
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue(err.message);
      }
    }
  },
);

export const userResetPasswordPing = createAsyncThunk(
  "user/forgot_password_reset_check",
  async (
    { token, email, time }: ResetPasswordPingCredentials,
    { rejectWithValue },
  ) => {
    try {
      if (!token || !email) {
        return rejectWithValue("Something went wrong!");
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        };
        const user = { token, email, time };
        const { data } = await axios.post(
          `${backendURL}user/forgot_password_reset_check`,
          { user },
          config,
        );
        return data;
      }
    } catch (error: unknown) {
      const err = error as ApiError;
      if (err.response?.data.error) {
        return rejectWithValue(err.response.data.error);
      } else {
        return rejectWithValue(err.message);
      }
    }
  },
);
