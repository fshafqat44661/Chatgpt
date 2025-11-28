import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  FiEdit,
  FiMenu,
  FiMoreHorizontal,
  FiSettings,
} from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import img from "../../../assets/DBimg.svg";
import { useNavigate } from "react-router-dom";
import img1 from "../../../assets/icon.svg";
import img2 from "../../../assets/icon2.jpg";
import { toast } from "react-toastify";
import apiRequest from "../../../utils/apiRequest";
import { BsPersonLinesFill } from "react-icons/bs";
import { useApiResponse } from "../../../utils/context";
import { useSideBar } from "../../../utils/SideBarContext";
import { useConversation } from "../../../utils/conversationId";
import loader from "../../../assets/chatloader.gif";

const truncateText = (text, wordLimit) => {
  const safeText = String(text || "");
  const words = safeText.split(/\s+/);
  return words.length > wordLimit
    ? `${words.slice(0, wordLimit).join(" ")}...`
    : safeText;
};

function Sidebar({ isOpen, toggleSidebar, openModal }) {
  const [activeIndex, setActiveIndex] = useState({
    sectionIndex: 0,
    headingIndex: 0,
  });
  const [dropdownIndex, setDropdownIndex] = useState({});
  const [activeDropdown, setActiveDropdown] = useState(null);
  const profileDropdownRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState([]);
  // eslint-disable-next-line
  const [activeSection, setActiveSection] = useState(
    sections.length > 0 ? sections[0].label : ""
  );
  const sectionRefs = useRef([]);
  const navigate = useNavigate();

  const theme = localStorage.getItem("theme");
  const imgSrc = theme === "dark" ? img2 : img1;

  const username = "User"; // Default username since no auth
  const token = null; // No token needed

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
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setActiveDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdow = (dropdown) => {
    setActiveDropdown((prev) => (prev === dropdown ? null : dropdown));
  };

  const buttonRefs = useRef([]);

  const toggleDropdown = (sectionIndex, headingIndex, e) => {
    e.stopPropagation();
    setDropdownIndex((prev) => ({
      ...prev,
      [sectionIndex]: prev[sectionIndex] === headingIndex ? null : headingIndex,
    }));
  };

  const { isResponseReceived } = useApiResponse();

  const fetchChatHistory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiRequest("get", "/gpt/chat-history", {});
      const groupedData = groupChatHistory(response.data);
      setSections(groupedData);
    } catch (error) {
      toast.error("Failed to fetch chat history");
    } finally {
      setLoading(false);
    }
  }, []);

  const groupChatHistory = (data) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date) => date.toISOString().split("T")[0];

    const grouped = {
      Today: [],
      Yesterday: [],
      Previous7Days: [],
      Previous30Days: [],
    };

    const sortedData = [...data].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );

    const firstMessages = new Map();

    sortedData.forEach((item) => {
      if (!firstMessages.has(item.conversationId)) {
        firstMessages.set(item.conversationId, item);
      }
    });

    const uniqueFirstMessages = Array.from(firstMessages.values());

    uniqueFirstMessages.forEach((item) => {
      const itemDate = new Date(item.timestamp);
      const formattedDate = formatDate(itemDate);

      if (formattedDate === formatDate(today)) {
        grouped.Today.push(item);
      } else if (formattedDate === formatDate(yesterday)) {
        grouped.Yesterday.push(item);
      } else if (itemDate >= sevenDaysAgo) {
        grouped.Previous7Days.push(item);
      } else if (itemDate >= thirtyDaysAgo) {
        grouped.Previous30Days.push(item);
      }
    });

    Object.keys(grouped).forEach((key) => {
      grouped[key].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
    });

    return [
      { label: "Today", headings: grouped.Today },
      { label: "Yesterday", headings: grouped.Yesterday },
      { label: "Previous 7 Days", headings: grouped.Previous7Days },
      { label: "Previous 30 Days", headings: grouped.Previous30Days },
    ];
  };

  useEffect(() => {
    if (isResponseReceived) {
      fetchChatHistory();
    }
  }, [isResponseReceived, fetchChatHistory]);

  useEffect(() => {
    const handleScroll = () => {
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sectionRefs.current[i];
        if (section && section.getBoundingClientRect().top <= 60) {
          setActiveSection(sections[i].label);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [sections]);

  const { setClickedItem } = useSideBar();
  const handleItemClick = () => {
    setClickedItem(true);
    navigate("/", { replace: true, state: { conversationId: null } });
  };

  const DelChatHistory = async (conversationId, sectionIndex) => {
    try {
      const response = await apiRequest(
        "delete",
        `/gpt/chat-history/${conversationId}`,
        {}
      );
      if (response.status === 200) {
        fetchChatHistory();
        handleItemClick();
        setDropdownIndex((prev) => ({
          ...prev,
          [sectionIndex]: null,
        }));
      }
    } catch (error) {
      toast.error("Failed to delete chat history");
    }
  };

  useEffect(() => {
    setTimeout(() => fetchChatHistory(), 1000);
  }, [fetchChatHistory]);

  const { setConversationId } = useConversation();
  return (
    <div
      className={`fixed top-0 left-0 h-screen w-60 bg-backgroundfive shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 z-50`}
    >
      <div className="px-3 pt-3 pb-1 flex flex-col h-full justify-between">
        {isOpen && (
          <button
            onClick={toggleSidebar}
            className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full absolute left-[14px]"
          >
            <FiMenu size={20} />
          </button>
        )}

        {isOpen && (
          <button
            className="p-2 text-text hover:text-texttwo hover:bg-backgroundthree rounded-full right-4 absolute"
            onClick={handleItemClick}
          >
            <FiEdit size={20} />
          </button>
        )}

        <div className="mt-11 mb-1.5 space-y-1 flex-grow">
          <button
            onClick={handleItemClick}
            className="w-full p-2 bg-transparent rounded-lg hover:bg-backgroundtwo flex items-center space-x-3 group"
          >
            <img
              src={imgSrc}
              alt="Icon"
              className="w-7 h-7 dark:bg-white rounded-full flex-shrink-0 border-[1px] p-1 border-border"
            />
            <span className="text-text text-sm">Chat Connect</span>
            <FiEdit
              size={17}
              className="text-text opacity-0 group-hover:opacity-100 right-6 absolute transition-opacity duration-200"
            />
          </button>
        </div>

        <div className="mt-2 space-y-1 flex flex-col h-full scrollbar-custom relative">
          {sections &&
          sections.some((section) => section.headings.length > 0) ? (
            sections.map(
              (section, sectionIndex) =>
                section.headings.length > 0 && (
                  <div
                    key={section.label}
                    ref={(el) => (sectionRefs.current[sectionIndex] = el)}
                  >
                    <div
                      className="text-xs text-text py-1 sticky font-semibold top-0 bg-backgroundfive mb-2 z-10"
                      style={{ paddingLeft: "8px" }}
                    >
                      {section.label}
                    </div>
                    {[...section.headings]
                      .reverse()
                      .filter(
                        (heading) => heading.query
                      )
                      .map((heading, headingIndex) => {
                        const truncatedHeading = truncateText(
                          heading.query,
                          20
                        );

                        return (
                          <div key={headingIndex} className="relative">
                            <button
                              onClick={() => {
                                setConversationId(heading.conversationId);
                                setActiveIndex({ sectionIndex, headingIndex });
                                // Navigate to ensure proper state reset
                                navigate("/", { 
                                  replace: true, 
                                  state: { conversationId: heading.conversationId } 
                                });
                              }}
                              className={`w-full p-[8.5px] mb-1 rounded-lg flex items-center justify-between space-x-3 group ${
                                activeIndex.sectionIndex === sectionIndex &&
                                activeIndex.headingIndex === headingIndex
                                  ? "bg-backgroundtwo"
                                  : "hover:bg-backgroundtwo"
                              }`}
                            >
                              <div className="flex items-center space-x-3 flex-grow">
                                <span
                                  className={`text-sm block text-left ${
                                    activeIndex.sectionIndex === sectionIndex &&
                                    activeIndex.headingIndex === headingIndex
                                      ? "text-text font-medium"
                                      : "text-text"
                                  }`}
                                  style={{
                                    display: "-webkit-box",
                                    WebkitBoxOrient: "vertical",
                                    WebkitLineClamp: 1,
                                    overflow: "hidden",
                                  }}
                                >
                                  {truncatedHeading}
                                </span>
                              </div>
                              <span
                                ref={(el) =>
                                  (buttonRefs.current[headingIndex] = el)
                                }
                                onClick={(e) =>
                                  toggleDropdown(sectionIndex, headingIndex, e)
                                }
                                className={`text-text transition-opacity duration-200 ${
                                  activeIndex.sectionIndex === sectionIndex &&
                                  activeIndex.headingIndex === headingIndex
                                    ? ""
                                    : "opacity-0 group-hover:opacity-100"
                                }`}
                              >
                                <FiMoreHorizontal size={17} />
                              </span>
                            </button>

                            {dropdownIndex[sectionIndex] === headingIndex && (
                              <div
                                className="absolute mt-1 !left-[90px] !top-8 w-28 p-2 bg-background shadow-lg rounded-lg"
                                style={{
                                  zIndex: 1050,
                                  overflow: "visible",
                                }}
                              >
                                <button
                                  onClick={() =>
                                    DelChatHistory(
                                      heading.conversationId,
                                      sectionIndex,
                                      headingIndex
                                    )
                                  }
                                  className="w-full flex items-center space-x-2 p-2 hover:bg-red-100 rounded-lg"
                                >
                                  <MdDelete className="text-red-600" />
                                  <span className="text-sm text-red-600">
                                    Delete
                                  </span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )
            )
          ) : loading ? (
            <div className="flex justify-center items-center mt-36">
              <img src={loader} alt="Loading..." className="w-14 h-14" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 mt-36">
              <img
                src={img}
                alt="No Data"
                className="w-1/2 h-auto animate-pulse"
              />
              <p className="text-text">No results yet.</p>
            </div>
          )}
        </div>

        <div className="mt-auto">
          {/* <button className="w-full mt-1 p-2 bg-transparent rounded-lg hover:bg-background flex items-center space-x-3">
            <BiCustomize size={17} className="text-text" />
            <div>
              <span className="block text-text text-sm text-left">
                Customize ChatConnect
              </span>
              <span className="block text-text text-xs text-center">
                More access to the best models
              </span>
            </div>
          </button> */}
          <div
            className="block relative cursor-pointer sm:hidden rounded-lg hover:bg-background w-full p-1.5"
            onClick={() => toggleDropdow("profile")}
            ref={profileDropdownRef}
          >
            <div className="flex items-center">
              <button className="flex items-center justify-center w-8 h-8 bg-pink-500 text-white font-semibold rounded-full">
                {initials}
              </button>
              <span className="ml-2 text-sm truncate font-medium text-text overflow-hidden text-ellipsis whitespace-nowrap max-w-xs">
                {username ? username : "Unknown User"}
              </span>
            </div>

            {activeDropdown === "profile" && (
              <div className="absolute bottom-10 right-0 w-56 bg-background shadow-lg rounded-lg border border-border z-50">
                <ul className="py-2">
                  <li
                    onClick={openModal}
                    className="flex items-center px-4 py-2 text-text hover:text-texttwo hover:bg-backgroundthree cursor-pointer"
                  >
                    <FiSettings size={20} className="mr-3" />
                    <span className="text-sm font-medium">Settings</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
