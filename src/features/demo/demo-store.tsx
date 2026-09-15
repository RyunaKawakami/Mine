"use client";

/* eslint-disable react-hooks/set-state-in-effect -- browser storage is intentionally hydrated after mount to keep SSR deterministic */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { demoSeed } from "./seed";
import type { DemoState, DemoTrip } from "./types";

const DATA_KEY = "mine-demo-data-v1";
const AUTH_KEY = "mine-demo-auth-v1";

type DemoStore = DemoState & {
  ready: boolean;
  authenticated: boolean;
  storageError: string | null;
  login: () => void;
  logout: () => void;
  saveTrip: (trip: DemoTrip) => void;
  deleteTrip: (id: string) => void;
  resetDemo: () => void;
  getTrip: (id: string) => DemoTrip | undefined;
};

const DemoContext = createContext<DemoStore | null>(null);

function cloneSeed(): DemoState {
  return JSON.parse(JSON.stringify(demoSeed)) as DemoState;
}

export function DemoProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DemoState>(cloneSeed);
  const [ready, setReady] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(DATA_KEY);
      if (saved) setState(JSON.parse(saved) as DemoState);
      setAuthenticated(window.localStorage.getItem(AUTH_KEY) === "true");
    } catch {
      setStorageError(
        "保存データを読み込めなかったため、初期データを表示しています。",
      );
    } finally {
      setReady(true);
    }
  }, []);

  const persist = useCallback((next: DemoState) => {
    setState(next);
    try {
      window.localStorage.setItem(DATA_KEY, JSON.stringify(next));
      setStorageError(null);
    } catch {
      setStorageError(
        "ブラウザの保存容量を超えました。大きな写真を減らして再度お試しください。",
      );
    }
  }, []);

  const value = useMemo<DemoStore>(
    () => ({
      ...state,
      ready,
      authenticated,
      storageError,
      login: () => {
        window.localStorage.setItem(AUTH_KEY, "true");
        setAuthenticated(true);
      },
      logout: () => {
        window.localStorage.removeItem(AUTH_KEY);
        setAuthenticated(false);
      },
      saveTrip: (trip) => {
        const exists = state.trips.some((item) => item.id === trip.id);
        persist({
          ...state,
          trips: exists
            ? state.trips.map((item) => (item.id === trip.id ? trip : item))
            : [trip, ...state.trips],
        });
      },
      deleteTrip: (id) =>
        persist({
          ...state,
          trips: state.trips.filter((trip) => trip.id !== id),
        }),
      resetDemo: () => persist(cloneSeed()),
      getTrip: (id) => state.trips.find((trip) => trip.id === id),
    }),
    [authenticated, persist, ready, state, storageError],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used inside DemoProvider");
  return context;
}
