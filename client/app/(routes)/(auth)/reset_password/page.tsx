"use client";

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  userResetPassword,
  userResetPasswordPing,
} from "@/app/_lib/actions/authAction";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useForm } from "react-hook-form";
import Notification from "@/app/_components/client/Notification";
import { useRouter, useSearchParams } from "next/navigation";
import { RootState } from "@/app/_lib/store";
import { AnyAction } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

interface ResetPasswordFormData {
  newPassword: string;
  rePassword: string;
}

const ResetPasswordPage: React.FC = () => {
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const time = searchParams.get("time");
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [notificationMessage, setNotificationMessage] = useState('');
  const { register, handleSubmit } = useForm<ResetPasswordFormData>();
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

  const submitForm = async (data: ResetPasswordFormData) => {
    try {
      const resultAction = await dispatch(
        userResetPassword({
          ...data,
          token: token!,
          email: email!,
          time: time!,
        }),
      );
      if (userResetPassword.fulfilled.match(resultAction)) {
        replace("/");
      } else if (userResetPassword.rejected.match(resultAction)) {
        toast.error("Failed to reset password");
      }
    } catch (error) {
      console.log("Unexpected error:", error);
    }
  };

  const pingResetPassword = async (
    token: string | null,
    email: string | null,
    time: string | null,
  ) => {
    const resultAction = await dispatch(
      userResetPasswordPing({ token: token!, email: email!, time: time! }),
    );

    if (userResetPasswordPing.fulfilled.match(resultAction)) {
      console.log("Correct token and slug given");
    } else if (userResetPasswordPing.rejected.match(resultAction)) {
      replace("/");
    }
  };

  useEffect(() => {
    if (!token || !email) {
      replace("/");
    } else {
      pingResetPassword(token, email, time);
    }
  }, []);

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
          Reset Password
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
                htmlFor="newPassword"
                className="block text-sm font-medium leading-6 "
              >
                New Password
              </label>
            </div>

            <div className="mt-2">
              <input
                id="newPassword"
                // name="email"
                type="password"
                required
                {...register("newPassword")}
                className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="rePassword"
                className="block text-sm font-medium leading-6 "
              >
                ReType Password
              </label>
            </div>

            <div className="mt-2">
              <input
                id="rePassword"
                // name="rePassword"
                type="password"
                required
                {...register("rePassword")}
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

export default ResetPasswordPage;
