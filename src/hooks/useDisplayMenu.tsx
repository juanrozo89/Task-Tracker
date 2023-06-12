import { useState, useEffect, useRef } from "react";

const useDisplayMenu = () => {
  const [displayMenu, setDisplayMenu] = useState(false);
  let menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) {
        setDisplayMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
    };
  });

  return { displayMenu, setDisplayMenu, menuRef };
};

export default useDisplayMenu;
