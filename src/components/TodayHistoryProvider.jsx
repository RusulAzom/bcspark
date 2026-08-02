"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TodayHistoryContext = createContext(null);

function getDhakaDateKey() {
  const dateParts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date()).reduce((parts, part) => {
    parts[part.type] = part.value;
    return parts;
  }, {});

  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export function TodayHistoryProvider({ children }) {
  const [state, setState] = useState({ data: null, isLoading: true, error: false });

  useEffect(() => {
    const controller = new AbortController();

    async function loadTodayHistory(dateKey) {
      try {
        const response = await fetch(`/api/history/today?date=${dateKey}`, { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load today's history");
        setState({ data: await response.json(), isLoading: false, error: false });
      } catch (error) {
        if (error.name !== "AbortError") setState({ data: null, isLoading: false, error: true });
      }
    }

    let activeDateKey = getDhakaDateKey();
    loadTodayHistory(activeDateKey);

    const dateCheck = window.setInterval(() => {
      const nextDateKey = getDhakaDateKey();
      if (nextDateKey !== activeDateKey) {
        activeDateKey = nextDateKey;
        loadTodayHistory(activeDateKey);
      }
    }, 60_000);

    return () => {
      controller.abort();
      window.clearInterval(dateCheck);
    };
  }, []);

  return <TodayHistoryContext.Provider value={state}>{children}</TodayHistoryContext.Provider>;
}

export function useTodayHistory() {
  const context = useContext(TodayHistoryContext);
  if (!context) throw new Error("useTodayHistory must be used within TodayHistoryProvider");
  return context;
}
