import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IpcClient } from "@/ipc/ipc_client";
import type { UpsertAccountParams, Account } from "@/ipc/ipc_types";

export function useUpsertAccount() {
  const queryClient = useQueryClient();

  const mutation = useMutation<Account[], Error, UpsertAccountParams>({
    mutationFn: async (params: UpsertAccountParams) => {
      if (!params.provider) {
        throw new Error("Provider is required");
      }
      const ipc = IpcClient.getInstance();
      const result = await ipc.upsertAccount(params);
      return result as Account[];
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      // You can add a global toast handler via meta or here
      console.error(error);
    },
    meta: { showErrorToast: true },
  });

  return {
    upsertAccount: (params: UpsertAccountParams) => mutation.mutateAsync(params),
    ...mutation,
  };
}