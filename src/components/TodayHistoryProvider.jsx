"use client";

import { createContext, useContext, useEffect, useState } from "react";

const TodayHistoryContext = createContext(null);

export function TodayHistoryProvider({ children }) {
  const [state, setState] = useState({ data: null, isLoading: true, error: false });

  useEffect(() => {
    const controller = new AbortController();

    async function loadTodayHistory() {
      try {
        const response = await fetch("/api/history/today", { signal: controller.signal });
        if (!response.ok) throw new Error("Unable to load today's history");
        setState({ data: await response.json(), isLoading: false, error: false });
      } catch (error) {
        if (error.name !== "AbortError") setState({ data: null, isLoading: false, error: true });
      }
    }

    loadTodayHistory();
    return () => controller.abort();
  }, []);

  return <TodayHistoryContext.Provider value={state}>{children}</TodayHistoryContext.Provider>;
}

export function useTodayHistory() {
  const context = useContext(TodayHistoryContext);
  if (!context) throw new Error("useTodayHistory must be used within TodayHistoryProvider");
  return context;
}
