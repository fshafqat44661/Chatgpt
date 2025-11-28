import React, { useState } from "react";
import { MdClose } from "react-icons/md";

export default function Bar() {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="flex justify-center items-center rounded-xl py-2.5 px-2.5 w-full max-w-screen-md shadow-md relative mx-auto">
      <div className="flex-1 flex-col sm:flex-row sm:flex-1 sm:text-left">
        <h1 className="sm:text-base font-semibold text-sm">You’ve hit the Free plan limit for GPT-4o.</h1>
        <p className="sm:text-xs text-[11px] text-gray-500">Responses will use GPT-3.5v until your limit resets after 4:36 AM.</p>
        <button className="mt-3 px-4 py-2 text-sm text-white bg-gray-800 rounded-3xl sm:absolute sm:right-8 sm:bottom-3">
          Get Plus
        </button>
      </div>

      <div className="flex justify-end items-start absolute top-2 right-2 sm:top-5">
        <MdClose
          className="text-gray-600 cursor-pointer"
          size={20}
          onClick={handleClose}
        />
      </div>
    </div>
  );
}
