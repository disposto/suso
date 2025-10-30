import { useQuery } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import type { Account } from "@/ipc/ipc_types";

export function useAccounts() {
  return useQuery<Account[], Error>({
    queryKey: ["accounts"],
    queryFn: async () => {
      const ipc = IpcClient.getInstance();
      const data = await ipc.listAccounts();
      return data as Account[];
    },
    meta: { showErrorToast: true },
  });
}