import { useMutation } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import { showError, showSuccess } from "@/lib/toast";
import { useRunApp } from "@/hooks/useRunApp";

// Custom hook to clear preview/session data and refresh iframe.
// Defined at module scope to ensure stable hook order across renders.
export function useClearSessionData() {
  const { refreshAppIframe } = useRunApp();

  return useMutation({
    mutationFn: () => {
      const ipcClient = IpcClient.getInstance();
      return ipcClient.clearSessionData();
    },
    onSuccess: async () => {
      await refreshAppIframe();
      showSuccess("Preview data cleared");
    },
    onError: (error) => {
      showError(`Error clearing preview data: ${error}`);
    },
  });
}