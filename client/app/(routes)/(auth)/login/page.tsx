"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userLogin } from "@/app/_lib/actions/authAction";
import { RootState } from "@/app/_lib/store";
import { useForm } from "react-hook-form";
import Notification from "@/app/_components/client/Notification";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearError, clearSuccess } from "@/app/_lib/slices/authSlice";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { AnyAction } from "@reduxjs/toolkit";
// Define the form input types
interface LoginFormInputs {
  email: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const { replace } = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>();

  // Properly typed state and dispatch
  const { loading, error, message, isAuthenticated } = useSelector(
    (state: RootState) => state.auth,
  );
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  // Handle notifications
  useEffect(() => {
    if (error) {
      setNotificationType('error');
      setNotificationMessage(error);
      setShowNotification(true);
    } else if (message) {
      setNotificationType('success');
      setNotificationMessage(message);
      setShowNotification(true);
    }
  }, [error, message]);

  // Redirect if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      replace("/"); // or wherever you want to redirect after login
    }
  }, [isAuthenticated, replace]);

  // Clear messages when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const submitForm = async (data: LoginFormInputs) => {
    try {
      await dispatch(userLogin(data)).unwrap();
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <div className="flex justify-center mb-4">
          <div className="rounded-full overflow-hidden w-24 h-24 relative cursor-pointer">
            <img
              src="https://api.dicebear.com/9.x/initials/svg?seed=CX"
              alt="Company Logo"
              className="object-contain"
              onClick={() => replace("/")}
            />
          </div>
        </div>
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Login to your account
        </h2>
      </div>

      {showNotification && (
        <Notification
          message={notificationMessage}
          type={notificationType}
          onClose={() => setShowNotification(false)}
          position="top-right"
        />
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit(submitForm)}>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email address
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.email ? "ring-red-500" : "ring-gray-300"
                  }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Password
              </label>
              <div className="text-sm">
                <Link
                  href="/forgot_password"
                  className="font-semibold text-black hover:text-gray-800"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.password ? "ring-red-500" : "ring-gray-300"
                  }`}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Please Wait..." : "Login"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not Registered?{" "}
          <Link
            href="/signup"
            className="font-semibold leading-6 text-black hover:text-gray-800"
          >
            Signup Here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
