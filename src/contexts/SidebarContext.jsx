import React, { createContext, useContext, useState } from "react";

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <SidebarContext.Provider
      value={{ isMobileSidebarOpen, setIsMobileSidebarOpen }}
    >
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    return { isMobileSidebarOpen: false, setIsMobileSidebarOpen: () => {} };
  }
  return context;
};
