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
    });

    // Subscribe to auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setSession(newSession ?? null);
        setUser(newSession?.user ?? null);
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