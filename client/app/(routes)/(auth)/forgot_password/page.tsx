"use client";

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userForgotPassword } from "@/app/_lib/actions/authAction";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import Notification from "@/app/_components/client/Notification";
import { useRouter } from "next/navigation";
import { RootState } from "@/app/_lib/store";
import { AnyAction } from "@reduxjs/toolkit";

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPasswordPage: React.FC = () => {
  const { replace } = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const { register, handleSubmit } = useForm<ForgotPasswordFormData>();
  const userState = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<ThunkDispatch<RootState, unknown, AnyAction>>();

  // Handle notifications
  useEffect(() => {
    if (userState.error) {
      setNotificationType('error');
      setNotificationMessage(userState.error);
      setShowNotification(true);
    } else if (userState.message) {
      setNotificationType('success');
      setNotificationMessage(userState.message);
      setShowNotification(true);
    }
  }, [userState.error, userState.message]);

  const submitForm = (data: ForgotPasswordFormData) => {
    dispatch(userForgotPassword(data));
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
        <h2 className="mt-10 w-72 text-center text-2xl font-bold leading-9 tracking-tight ">
          Forgot Password
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
                className="block text-sm font-medium leading-6 "
              >
                Email address
              </label>
            </div>
            <div className="mt-2">
              <input
                id="email"
                // name="email"
                type="email"
                required
                {...register("email")}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {userState.loading ? "Please Wait.." : "Submit"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not Registered? &nbsp;
          <a
            href="/signup"
            className="font-semibold leading-6 text-black hover:text-gray-800"
          >
            Signup Here!
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
