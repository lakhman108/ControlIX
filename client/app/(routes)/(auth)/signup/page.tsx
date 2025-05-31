"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { userSignup } from "@/app/_lib/actions/authAction";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import Notification from "@/app/_components/client/Notification";
import Link from "next/link";
import { RootState } from "@/app/_lib/store";
import { clearError, clearSuccess } from "@/app/_lib/slices/authSlice";
import { AnyAction } from "@reduxjs/toolkit";

interface SignupFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignupPage: React.FC = () => {
  const { replace } = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignupFormInputs>();

  const { loading, error, message } = useSelector(
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

  useEffect(() => {
    return () => {
      dispatch(clearError());
      dispatch(clearSuccess());
    };
  }, [dispatch]);

  const submitForm = async (data: SignupFormInputs) => {
    try {
      await dispatch(userSignup(data)).unwrap();
      reset();
    } catch (err) {
      console.log("Signup failed:", err);
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
          Create your new Account
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
          <div className="text-start">
            <label
              htmlFor="name"
              className="block  text-sm font-medium leading-6"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                id="name"
                type="text"
                autoComplete="name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
                className={`block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 ${errors.name ? "ring-red-500" : "ring-gray-300"
                  }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          <div className="text-start">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
            >
              Email address
            </label>
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

          <div className="text-start">
            <label
              htmlFor="password"
              className="block text-sm font-medium leading-6"
            >
              Password
            </label>
            <div className="mt-2">
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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
              {loading ? "Please Wait..." : "Sign Up"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Already Registered?{" "}
          <Link
            href="/login"
            className="font-semibold leading-6 text-black hover:text-gray-800"
          >
            Login Here!
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
