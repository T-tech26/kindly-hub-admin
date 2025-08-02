"use client"; // required for useState and useRef in app dir

import React, { createContext, useContext, useState } from "react";

type LayoutContextType = {
    toggleMenu: string;
    setToggleMenu: React.Dispatch<React.SetStateAction<string>>;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

export const useLayoutContext = () => {
  const context = useContext(LayoutContext);
  if (!context) throw new Error("LayoutContext is not available");
  return context;
};

export const LayoutProvider = ({ children }: { children: React.ReactNode }) => {

  const [toggleMenu, setToggleMenu] = useState('');

  return (
    <LayoutContext.Provider
      value={{
        toggleMenu,
        setToggleMenu
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};