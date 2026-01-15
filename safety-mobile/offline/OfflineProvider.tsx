import NetInfo from "@react-native-community/netinfo";
import { AppState } from "react-native";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  initializeOfflineStore,
  refreshPendingCount,
  syncOnce,
  type SyncRunResult,
} from "./sync";

type OfflineContextValue = {
  ready: boolean;
  isOnline: boolean;
  syncing: boolean;
  pendingMutations: number;
  lastSyncedAt: string | null;
  syncNow: () => Promise<SyncRunResult | void>;
};

const OfflineContext = createContext<OfflineContextValue | null>(null);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [pendingMutations, setPendingMutations] = useState(0);
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      await initializeOfflineStore();
      const pending = await refreshPendingCount();
      setPendingMutations(pending);
      setReady(true);
    };
    void bootstrap();
  }, []);

  const syncNow = useCallback(async () => {
    if (syncing || !ready) return;
    setSyncing(true);
    try {
      const result = await syncOnce();
      setPendingMutations(result.pendingMutations);
      setLastSyncedAt(new Date().toISOString());
      return result;
    } catch (err) {
      console.warn("[offline] sync failed", err);
    } finally {
      setSyncing(false);
    }
  }, [ready, syncing]);

  useEffect(() => {
    const subscription = NetInfo.addEventListener((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      if (online && ready) {
        void syncNow();
      }
    });

    NetInfo.fetch().then((state) => {
      const online = Boolean(state.isConnected && state.isInternetReachable !== false);
      setIsOnline(online);
      if (online && ready) {
        void syncNow();
      }
    });

    return () => subscription();
  }, [ready, syncNow]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      if (next === "active" && isOnline && ready) {
        void syncNow();
      }
    });
    return () => sub.remove();
  }, [isOnline, ready, syncNow]);

  const value = useMemo(
    () => ({
      ready,
      isOnline,
      syncing,
      pendingMutations,
      lastSyncedAt,
      syncNow,
    }),
    [ready, isOnline, syncing, pendingMutations, lastSyncedAt, syncNow]
  );

  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>;
}

export function useOffline() {
  const ctx = useContext(OfflineContext);
  if (!ctx) throw new Error("useOffline must be used within OfflineProvider");
  return ctx;
}
