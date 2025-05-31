"use client";

const SuccessMessage = ({ message }: { message: string }) => {
  return (
    <div
      className="bg-green-100 text-green-700 border border-green-400 px-2 mt-5 py-2 rounded relative"
      role="alert"
    >
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default SuccessMessage;
