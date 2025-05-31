"use client";

const ErrorMessage = ({ message }: { message: string }) => {
  return (
    <div
      className="bg-red-100 text-red-700 border border-red-400 px-2 mt-5 py-2 rounded relative"
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage;
