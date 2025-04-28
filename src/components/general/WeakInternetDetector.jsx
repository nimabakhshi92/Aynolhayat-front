import React, { useState, useEffect } from "react";

const WeakInternetDetector = () => {
  const [isWeakConnection, setIsWeakConnection] = useState(null);
  // const [weakConnectionReported, setWeakConnectionReported] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const checkLatency = async () => {
      const startTime = Date.now();
      try {
        await fetch(`https://jsonplaceholder.typicode.com/posts/`, {
          method: "HEAD",
        });
        const endTime = Date.now();
        const duration = endTime - startTime;
        setIsWeakConnection((prev) =>
          duration > 2000 ? 2 : duration > 1000 ? 1 : prev > 0 ? 0 : null
        );
      } catch (error) {
        console.error("Error checking latency:", error);
        setIsWeakConnection(3);
      }
    };

    // Check every 5 seconds
    const interval = setInterval(checkLatency, 5000);
    checkLatency();

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useEffect(() => {
    if (isWeakConnection === 0) {
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 3000);
    }
  }, [isWeakConnection]);

  const onlineProps = {
    style: {
      background: "var(--primary-color)",
      display: "block",
    },
    text: "سرعت اینترنت مطلوب است",
  };

  const badProps = {
    style: {
      background: "orange",
      display: "block",
    },
    text: "سرعت اینترنت اندکی ضعیف به نظر می رسد",
  };

  const veryPoorProps = {
    style: {
      background: "yellow",
      display: "block",
      color: "black",
    },
    text: "سرعت اینترنت ضعیف به نظر می رسد",
  };

  const noInternetProps = {
    style: {
      background: "red",
      display: "block",
    },
    text: "ممکن است اینترنت قطع باشد",
  };

  const normalProps = {
    style: {
      display: "none",
    },
  };

  const prop =
    isWeakConnection == 3
      ? noInternetProps
      : isWeakConnection == 2
        ? veryPoorProps
        : isWeakConnection === 1
          ? badProps
          : isWeakConnection === 0 && showMessage
            ? onlineProps
            : normalProps;

  return (
    <div
      className="fixed top-0 max-sm:w-[45%] text-2xl max-sm:left-1/2 max-sm:-translate-x-1/2 w-full lg:left-0 text-white text-center p-1 z-[1000]"
      style={{
        transition: "all 1s linear",
        ...prop.style,
      }}
    >
      {prop.text}
    </div>
  );
};

export default WeakInternetDetector;
