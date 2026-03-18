import { useState, useEffect, useRef } from "react";
import { timeAPI } from "../services/api";

const useTimeControl = () => {
  const [isExpired, setIsExpired] = useState(false);
  const [remainingMs, setRemainingMs] = useState(null);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const fetchStatus = async () => {
    try {
      const { data } = await timeAPI.getStatus();
      setIsExpired(data.isExpired);
      setRemainingMs(data.remainingMs);
    } catch {
      // If backend unreachable, allow access (mock mode)
      setIsExpired(false);
      setRemainingMs(20 * 60 * 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    // Re-check every minute
    intervalRef.current = setInterval(fetchStatus, 60000);
    return () => clearInterval(intervalRef.current);
  }, []);

  // Local countdown (decrement every second)
  useEffect(() => {
    if (remainingMs === null || isExpired) return;
    countdownRef.current = setInterval(() => {
      setRemainingMs((prev) => {
        if (prev <= 1000) {
          setIsExpired(true);
          clearInterval(countdownRef.current);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(countdownRef.current);
  }, [remainingMs, isExpired]);

  const formatRemaining = () => {
    if (remainingMs === null) return "--:--";
    const totalSec = Math.floor(remainingMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  return { isExpired, remainingMs, loading, formatRemaining };
};

export default useTimeControl;
