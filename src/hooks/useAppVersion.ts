import { useState, useEffect } from "react";
import { IpcClient } from "@/ipc/ipc_client";

export function useAppVersion() {
  const [appVersion, setAppVersion] = useState<string | null>(null);
  const isElectron = Boolean((window as any)?.electron?.ipcRenderer);

  useEffect(() => {
    const fetchVersion = async () => {
      try {
        if (!isElectron) {
          setAppVersion(null);
          return;
        }
        const version = await IpcClient.getInstance().getAppVersion();
        setAppVersion(version);
      } catch {
        setAppVersion(null);
      }
    };
    fetchVersion();
  }, [isElectron]);

  return appVersion;
}
