import React, { useState } from "react";
import Navbar from "../ui-components/LandingPage/CommonUi/Navbar";
import { Outlet } from "react-router-dom";
import Sidebar from "../ui-components/LandingPage/CommonUi/Sidebar";
import SettingsModal from "../ui-components/LandingPage/SettingsModal/Modal";
import { ApiResponseProvider } from "../utils/context";
import { SideBarProvider } from "../utils/SideBarContext";
import { ConversationProvider } from "../utils/conversationId";

const Layout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="relative bg-background h-screen flex flex-col">
      <ApiResponseProvider>
        <SideBarProvider>
          <ConversationProvider>
          <Navbar
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
            openModal={openModal}
          />
          <Sidebar
            isOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            openModal={openModal}
          />
          <div
            className={`transition-transform duration-300 ${
              isSidebarOpen ? "md:ml-60" : "ml-0"
            }`}
          >
            <main>
              <Outlet context={{ isSidebarOpen }} />
            </main>
          </div>
          {isModalOpen && <SettingsModal closeModal={closeModal} />}
          </ConversationProvider>
        </SideBarProvider>
      </ApiResponseProvider>
    </div>
  );
};

export default Layout;
