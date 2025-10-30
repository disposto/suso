import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSupabase } from "@/lib/supabase";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";

interface CreditsRow {
  user_id: string;
  balance: number;
  updated_at: string;
}

export function useCredits() {
  const supabase = getSupabase();
  const { user } = useSupabaseAuth();
  const queryClient = useQueryClient();

  const {
    data: credits,
    isLoading,
    error,
    refetch,
  } = useQuery<CreditsRow | null, Error>({
    queryKey: ["credits", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credits")
        .select("user_id,balance,updated_at")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data ?? { user_id: user!.id, balance: 0, updated_at: new Date().toISOString() };
    },
    initialData: null,
  });

  const adjustMutation = useMutation<{ balance: number }, Error, { delta: number }>({
    mutationFn: async ({ delta }) => {
      const { error } = await supabase.rpc("adjust_credits", { delta });
      if (error) throw error;
      const { data, error: selError } = await supabase
        .from("credits")
        .select("balance")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (selError) throw selError;
      return { balance: data?.balance ?? 0 };
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["credits", user?.id] });
    },
  });

  return {
    credits,
    loading: isLoading,
    error,
    refresh: refetch,
    adjustCredits: adjustMutation.mutateAsync,
    adjusting: adjustMutation.isPending,
  };
}