import { useEffect, useMemo } from "react";
import { useAtom } from "jotai";
import { authSessionAtom, authUserAtom } from "@/atoms/authAtoms";
import { getSupabase, getOAuthRedirectTo, isElectron } from "@/lib/supabase";
import { IpcClient } from "@/ipc/ipc_client";
import { useSettings } from "@/hooks/useSettings";
import { useDeepLink } from "@/contexts/DeepLinkContext";

export function useSupabaseAuth() {
  const [session, setSession] = useAtom(authSessionAtom);
  const [user, setUser] = useAtom(authUserAtom);
  const supabase = getSupabase();
  const { settings, refreshSettings } = useSettings();
  const { lastDeepLink, clearLastDeepLink } = useDeepLink();

  useEffect(() => {
    // On mount, fetch current session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session ?? null);
      setUser(data.session?.user ?? null);
      // Ensure local account row exists and is active for email/password users
      if (isElectron() && data.session?.user?.email) {
        const u = data.session.user;
        const metaName = (u.user_metadata?.full_name || u.user_metadata?.name || u.user_metadata?.username || "").toString();
        IpcClient.getInstance()
          .upsertAccount({
            provider: "supabase",
            email: u.email,
            name: metaName || null,
            isActive: true,
          })
          .then(async () => {
            // Guarantee it's the single active account
            const rows = await IpcClient.getInstance().listAccounts();
            const match = rows.find((r) => r.provider === "supabase" && r.email === u.email);
            if (match?.id) {
              await IpcClient.getInstance().setActiveAccount({ id: match.id });
            }
          })
          .catch(() => {});
      }
    });

    // Subscribe to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);
        // Keep local account in sync when session changes (Electron only)
        if (isElectron() && newSession?.user?.email) {
          const u = newSession.user;
          const metaName = (u.user_metadata?.full_name || u.user_metadata?.name || u.user_metadata?.username || "").toString();
          IpcClient.getInstance()
            .upsertAccount({
              provider: "supabase",
              email: u.email,
              name: metaName || null,
              isActive: true,
            })
            .then(async () => {
              const rows = await IpcClient.getInstance().listAccounts();
              const match = rows.find((r) => r.provider === "supabase" && r.email === u.email);
              if (match?.id) {
                await IpcClient.getInstance().setActiveAccount({ id: match.id });
              }
            })
            .catch(() => {});
        }
      },
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, [setSession, setUser, supabase]);

  // In Electron, after the system browser completes OAuth and the app receives
  // the deep link, read tokens from settings and set the Supabase session in
  // the renderer so UI reflects authenticated state.
  useEffect(() => {
    const applyDeepLinkSession = async () => {
      if (!isElectron()) return;
      if (lastDeepLink?.type !== "supabase-oauth-return") return;
      // Ensure we have the latest settings written by the main process handler
      await refreshSettings();
      const accessToken = settings?.supabase?.accessToken?.value;
      const refreshToken = settings?.supabase?.refreshToken?.value;
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        } as any);
        // Clear deep link marker regardless to avoid repeated processing
        clearLastDeepLink();
        if (error) {
          // Surface error minimally; toast util may show it if needed
          // eslint-disable-next-line no-console
          console.debug("Falha ao aplicar sessão Supabase via deep link:", error);
        }
      } else {
        // eslint-disable-next-line no-console
        console.debug(
          "Deep link recebido, mas tokens Supabase ausentes nas configurações",
        );
        clearLastDeepLink();
      }
    };
    applyDeepLinkSession();
    // Only re-run when we receive a new deep link event
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastDeepLink?.timestamp]);

  const isAuthenticated = useMemo(() => Boolean(user), [user]);

  const signInWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signUpWithEmail = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      // You can add data for a profile row here, or use a trigger on auth.users
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const signInWithOAuth = async (provider: "github" | "google") => {
    const redirectTo = getOAuthRedirectTo();
    // In Electron, don't redirect the Electron window. Open the system browser.
    if (isElectron()) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          queryParams: {
            prompt: "consent",
          },
          // Prevent navigation in the Electron renderer; we will open the URL externally.
          skipBrowserRedirect: true,
        },
      });
      if (error) throw error;
      const url = (data as any)?.url as string | undefined;
      if (!url) throw new Error("Falha ao obter URL de login do provedor");
      await IpcClient.getInstance().openExternalUrl(url);
      return;
    }
    // Web preview: use the normal redirect-based flow.
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo,
        queryParams: {
          prompt: "consent",
        },
      },
    });
    if (error) throw error;
  };

  return {
    session,
    user,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    signInWithOAuth,
  };
}