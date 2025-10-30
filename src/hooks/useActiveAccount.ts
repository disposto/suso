import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import type { Account, SetActiveAccountParams } from "@/ipc/ipc_types";
import { useAccounts } from "./useAccounts";

export function useActiveAccount() {
  const queryClient = useQueryClient();
  const { data: accounts, isLoading } = useAccounts();

  const activeAccount = useMemo(() => {
    return (accounts || []).find((a) => a.isActive) || null;
  }, [accounts]);

  const mutation = useMutation<Account[], Error, SetActiveAccountParams>({
    mutationFn: async (params: SetActiveAccountParams) => {
      const ipc = IpcClient.getInstance();
      const result = await ipc.setActiveAccount(params);
      return result as Account[];
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    meta: { showErrorToast: true },
  });

  return {
    activeAccount,
    isLoading,
    setActiveAccount: (params: SetActiveAccountParams) => mutation.mutateAsync(params),
    ...mutation,
  };
}