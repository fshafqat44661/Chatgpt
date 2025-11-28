import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import DarkMode from "../../../DarkMode/DarkMode";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import { FaExclamationTriangle } from "react-icons/fa";

const SettingsModal = ({ closeModal }) => {
  const token = null; // No authentication required
  const [showConfirmation, setShowConfirmation] = useState(false);

  // No logout needed since no authentication

  const handleDelChat = async () => {
    try {
      const response = await apiRequest(
        "delete",
        "/gpt/delete",
        {}
      );

      if (
        response.data.message === "All chat history deleted successfully"
      ) {
        toast.success(response.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error("No chat history found to delete.");
    }
  };

  const handleConfirmDelete = () => {
    handleDelChat();
    setShowConfirmation(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center z-50">
      <div className="absolute inset-0 bg-white dark:bg-black bg-opacity-70 z-40 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-lg bg-background shadow-xl rounded-lg py-6 z-50">
        <div className="flex text-text items-center justify-between border-b pb-4 mb-4 px-6">
          <h2 className="text-md font-semibold">Settings</h2>
          <button
            onClick={closeModal}
            className="text-text hover:text-texthover transition"
          >
            <IoClose size={24} />
          </button>
        </div>

        <div className="flex flex-col space-y-3 px-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-text">Theme</span>
            <div className="flex items-center space-x-3">
              <DarkMode />
            </div>
          </div>
          <hr className="border-border my-2" />

          <div className="flex justify-between items-center">
            <span className="text-sm text-text">Delete all chats</span>
            <button
              onClick={() => setShowConfirmation(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-full text-xs font-semibold hover:bg-red-700 transition"
            >
              Delete all
            </button>
          </div>
          <hr className="border-border my-2" />

          {/* No logout option since no authentication */}
        </div>
      </div>

      {showConfirmation && (
        <div className="fixed inset-0 flex justify-center items-center z-[9999]">
          <div className="absolute inset-0 bg-black bg-opacity-50 z-[9998]"></div>
          <div className="relative bg-backgroundtwo rounded-lg p-8 shadow-lg z-[10000] max-w-lg w-full">
            <div className="flex items-center mb-4">
              <FaExclamationTriangle className="w-6 h-6 text-red-600 mr-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                Are you sure you want to delete all chat history?
              </h3>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-full hover:bg-gray-300 transition mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsModal;
