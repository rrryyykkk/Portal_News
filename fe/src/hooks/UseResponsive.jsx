import { useEffect, useState } from "react";

const UseResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mobile = window.matchMedia("(max-width: 640px)");
    const tablet = window.matchMedia(
      "(min-width: 641px) and (max-width: 1024px)"
    );
    const desktop = window.matchMedia("(min-width: 1025px)");

    const updateScreenSize = () => {
      setIsMobile(mobile.matches);
      setIsTablet(tablet.matches);
      setIsDesktop(desktop.matches);
    };

    
        updateScreenSize();
    mobile.addEventListener("change", updateScreenSize);
    tablet.addEventListener("change", updateScreenSize);
    desktop.addEventListener("change", updateScreenSize);

    return () => {
      mobile.removeEventListener("change", updateScreenSize);
      tablet.removeEventListener("change", updateScreenSize);
      desktop.removeEventListener("change", updateScreenSize);
    };
  }, []);
  return {
    isMobile,
    isTablet,
    isDesktop,
  };
};

export default UseResponsive;
