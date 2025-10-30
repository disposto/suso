import { useState, useEffect, useCallback } from "react";
import { useAtom } from "jotai";
import { appBasePathAtom, appsListAtom } from "@/atoms/appAtoms";
import { IpcClient } from "@/ipc/ipc_client";

export function useLoadApps() {
  const isElectron = Boolean((window as any)?.electron?.ipcRenderer);
  const [apps, setApps] = useAtom(appsListAtom);
  const [, setAppBasePath] = useAtom(appBasePathAtom);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refreshApps = useCallback(async () => {
    setLoading(true);
    try {
      if (!isElectron) {
        // In web preview, skip IPC; present empty list without errors
        setApps([]);
        setAppBasePath("");
        setError(null);
        return;
      }
      const ipcClient = IpcClient.getInstance();
      const appListResponse = await ipcClient.listApps();
      setApps(appListResponse.apps);
      setAppBasePath(appListResponse.appBasePath);
      setError(null);
    } catch (error) {
      // Reduce noise in console; report as debug in dev
      console.debug("Error refreshing apps:", error);
      setError(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setLoading(false);
    }
  }, [setApps, setError, setLoading, isElectron]);

  useEffect(() => {
    refreshApps();
  }, [refreshApps]);

  return { apps, loading, error, refreshApps };
}
