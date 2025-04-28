import React, { useState, useEffect } from "react";

const NoInternetAlarm = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowText(true);
      setTimeout(() => {
        setShowText(false);
      }, 4000);
    };
    const handleOffline = () => setIsOnline(false);

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const onlineProps = {
    style: {
      background: "var(--primary-color)",
      display: "block",
    },
    text: "اینترنت مجددا وصل شد",
  };

  const offlineProps = {
    style: {
      background: "var(--error-color)",
      display: "block",
    },
    text: "شما به اینترنت دسترسی ندارید",
  };

  const normalProps = {
    style: {
      display: "none",
    },
  };

  const prop = !isOnline
    ? offlineProps
    : isOnline && showText
      ? onlineProps
      : normalProps;

  return (
    <div
      className="fixed top-0 max-sm:w-[45%] text-2xl max-sm:left-1/2 max-sm:-translate-x-1/2 w-full lg:left-0 text-white text-center p-2 z-[1000]"
      style={{
        transition: "all 1s linear",
        ...prop.style,
      }}
    >
      {prop.text}
    </div>
  );
};

export default NoInternetAlarm;
