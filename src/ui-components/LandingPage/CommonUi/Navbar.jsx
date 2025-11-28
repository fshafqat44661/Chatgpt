import React, { useState, useEffect, useRef } from "react";
import { FiMenu, FiEdit, FiSettings } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { BsPersonLinesFill } from "react-icons/bs";
import { useSideBar } from "../../../utils/SideBarContext";

function Navbar({ toggleSidebar, isSidebarOpen, openModal }) {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const chatGPTDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);
  const navigate = useNavigate();
  const username = "User"; // Default username since no auth

  const getInitials = (name) => {
    if (!name) return "U";

    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0][0].toUpperCase();
    } else {
      return words
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("");
    }
  };
  const initials = getInitials(username);

  const handleClickOutside = (event) => {
    if (
      chatGPTDropdownRef.current &&
      !chatGPTDropdownRef.current.contains(event.target) &&
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setActiveDropdown(null);
    }
  };

  // No logout needed since no authentication

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const { setClickedItem } = useSideBar();

  const handleItemClick = () => {
    setClickedItem(true);
    navigate("/", { replace: true, state: { conversationId: null } });
  };

  return (
    <nav
      className={`bg-background transition-transform duration-300 ${
        isSidebarOpen ? "md:ml-60" : "ml-0"
      }`}
    >
      <div className="flex justify-center sm:justify-between items-center px-4 py-3  mx-auto">
        <div className="flex items-center space-x-1">
          {!isSidebarOpen && (
            <>
              <button
                onClick={toggleSidebar}
                className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full left-4 top-4 absolute sm:hidden"
              >
                <FiMenu size={20} />
              </button>
              <button
                onClick={toggleSidebar}
                className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full hidden sm:block"
              >
                <FiMenu size={20} />
              </button>
            </>
          )}
          {!isSidebarOpen && (
            <>
              <button className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full right-4 top-4 absolute sm:hidden">
                <FiEdit size={20} />
              </button>
              <button
                onClick={handleItemClick}
                className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full hidden sm:block"
              >
                <FiEdit size={20} />
              </button>
            </>
          )}

          <div
            className="relative flex items-center space-x-2 cursor-pointer p-2 rounded-lg"
            onClick={() => toggleDropdown("chatGPT")}
            ref={chatGPTDropdownRef}
          >
            <span
              onClick={() => navigate("/")}
              className="text-lg font-semibold text-text"
            >
              ChatConnect
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div
            className="sm:block relative hidden"
            onClick={() => toggleDropdown("profile")}
            ref={profileDropdownRef}
          >
            <button className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white font-semibold rounded-full">
              {initials}
            </button>
            {activeDropdown === "profile" && (
              <div className="absolute top-10 right-0 w-56 bg-background shadow-lg rounded-lg border border-border z-50">
                <ul className="py-2">
                  <li
                    onClick={openModal}
                    className="flex items-center px-4 py-2 text-text hover:text-texttwo hover:bg-backgroundthree cursor-pointer"
                  >
                    <FiSettings size={20} className=" mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
