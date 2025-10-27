import { useNavigate, useSearch } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";
import { homeChatInputValueAtom } from "../atoms/chatAtoms";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import { IpcClient } from "@/ipc/ipc_client";
import { generateCuteAppName } from "@/lib/utils";
import { useLoadApps } from "@/hooks/useLoadApps";
import { useSettings } from "@/hooks/useSettings";
import { SetupBanner } from "@/components/SetupBanner";
import { isPreviewOpenAtom } from "@/atoms/viewAtoms";
import { useState, useEffect, useCallback } from "react";
import { useStreamChat } from "@/hooks/useStreamChat";
import type { HomeSubmitOptions } from "@/components/chat/types";
import { HomeChatInput } from "@/components/chat/HomeChatInput";
import { usePostHog } from "posthog-js/react";
import { PrivacyBanner } from "@/components/TelemetryBanner";
import INSPIRATION_PROMPTS from "@/prompts/inspiration_prompts";
import { useAppVersion } from "@/hooks/useAppVersion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "@/contexts/ThemeContext";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { ImportAppButton } from "@/components/ImportAppButton";
import { showError } from "@/lib/toast";
import { invalidateAppQuery } from "@/hooks/useLoadApp";
import { useQueryClient } from "@tanstack/react-query";


import { NEON_TEMPLATE_IDS } from "@/shared/templates";
import { neonTemplateHook } from "@/client_logic/template_hook";
import { ProBanner } from "@/components/ProBanner";


export default function HomePage() {
  const [inputValue, setInputValue] = useAtom(homeChatInputValueAtom);
  const navigate = useNavigate();
  const search = useSearch({ from: "/" });
  const setSelectedAppId = useSetAtom(selectedAppIdAtom);
  const { refreshApps } = useLoadApps();
  const { settings, updateSettings } = useSettings();
  const setIsPreviewOpen = useSetAtom(isPreviewOpenAtom);
  const [isLoading, setIsLoading] = useState(false);
  const { streamMessage } = useStreamChat({ hasChatId: false });
  const posthog = usePostHog();
  const appVersion = useAppVersion();
  const [releaseNotesOpen, setReleaseNotesOpen] = useState(false);
  const [releaseUrl, setReleaseUrl] = useState("");
  const { theme } = useTheme();
  const queryClient = useQueryClient();
  useEffect(() => {
    const updateLastVersionLaunched = async () => {
      if (
        appVersion &&
        settings &&
        settings.lastShownReleaseNotesVersion !== appVersion
      ) {
        const shouldShowReleaseNotes = !!settings.lastShownReleaseNotesVersion;
        await updateSettings({
          lastShownReleaseNotesVersion: appVersion,
        });
        // It feels spammy to show release notes if it's
        // the users very first time.
        if (!shouldShowReleaseNotes) {
          return;
        }

        try {
          const result = await IpcClient.getInstance().doesReleaseNoteExist({
            version: appVersion,
          });

          if (result.exists && result.url) {
            setReleaseUrl(result.url + "?hideHeader=true&theme=" + theme);
            setReleaseNotesOpen(true);
          }
        } catch (err) {
          console.warn(
            "Unable to check if release note exists for: " + appVersion,
            err,
          );
        }
      }
    };
    updateLastVersionLaunched();
  }, [appVersion, settings, updateSettings, theme]);

  // Get the appId from search params
  const appId = search.appId ? Number(search.appId) : null;

  // State for random prompts
  const [randomPrompts, setRandomPrompts] = useState<
    typeof INSPIRATION_PROMPTS
  >([]);

  // Function to get random prompts
  const getRandomPrompts = useCallback(() => {
    const shuffled = [...INSPIRATION_PROMPTS].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, []);

  // Initialize random prompts
  useEffect(() => {
    setRandomPrompts(getRandomPrompts());
  }, [getRandomPrompts]);

  // Redirect to app details page if appId is present
  useEffect(() => {
    if (appId) {
      navigate({ to: "/app-details", search: { appId } });
    }
  }, [appId, navigate]);

  const handleSubmit = async (options?: HomeSubmitOptions) => {
    const attachments = options?.attachments || [];

    if (!inputValue.trim() && attachments.length === 0) return;

    const isElectron =
      typeof window !== "undefined" &&
      (window as any).electron &&
      (window as any).electron.ipcRenderer;

    if (!isElectron) {
      showError(
        "Criação de app disponível apenas na janela Electron. Abra o Suso pela janela Electron para usar esta função.",
      );
      return;
    }

    try {
      setIsLoading(true);
      // Create the chat and navigate
      const result = await IpcClient.getInstance().createApp({
        name: generateCuteAppName(),
      });
      if (
        settings?.selectedTemplateId &&
        NEON_TEMPLATE_IDS.has(settings.selectedTemplateId)
      ) {
        await neonTemplateHook({
          appId: result.app.id,
          appName: result.app.name,
        });
      }

      // Stream the message with attachments
      streamMessage({
        prompt: inputValue,
        chatId: result.chatId,
        attachments,
      });
      await new Promise((resolve) =>
        setTimeout(resolve, settings?.isTestMode ? 0 : 2000),
      );

      setInputValue("");
      setSelectedAppId(result.app.id);
      setIsPreviewOpen(false);
      await refreshApps(); // Ensure refreshApps is awaited if it's async
      await invalidateAppQuery(queryClient, { appId: result.app.id });
      posthog.capture("home:chat-submit");
      navigate({ to: "/chat", search: { id: result.chatId } });
    } catch (error) {
      console.error("Failed to create chat:", error);
      showError("Failed to create app. " + (error as any).toString());
      setIsLoading(false); // Ensure loading state is reset on error
    }
    // No finally block needed for setIsLoading(false) here if navigation happens on success
  };

  // Loading overlay for app creation
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center max-w-3xl m-auto p-8">
        <div className="w-full flex flex-col items-center">
          {/* Loading Spinner */}
          <div className="relative w-24 h-24 mb-8">
            <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 dark:border-gray-700 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-8 border-t-primary rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-gray-200">
            Building your app
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8">
            We're setting up your app with AI magic. <br />
            This might take a moment...
          </p>
        </div>
      </div>
    );
  }

  // Main Home Page Content
  return (
    <div className="w-full">
      <SetupBanner />

      {/* Hero minimalista com espaço negativo e foco no prompt */}
      <div className="max-w-6xl mx-auto px-6 pt-24 pb-16">
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Título principal */}
          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground">
            Construa com Suso
          </h1>
          <HomeChatInput onSubmit={handleSubmit} />

          {/* Ideias rápidas (chips minimalistas) */}
          <div className="flex flex-wrap gap-3">
            {randomPrompts.map((item, index) => (
              <button
                type="button"
                key={index}
                onClick={() => setInputValue(`Build me a ${item.label}`)}
                className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-border text-foreground hover:opacity-90"
              >
                <span className="text-foreground/80">{item.icon}</span>
                <span className="text-xs-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="flex justify-start">
            <button
              type="button"
              onClick={() => setRandomPrompts(getRandomPrompts())}
              className="flex items-center gap-2 px-3 py-2 rounded-[8px] border border-border text-foreground hover:opacity-90"
            >
              <svg
                className="w-5 h-5 text-foreground/80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              <span className="text-xs-sm font-medium">Mais ideias</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bloco secundário: Import e banners, discretos e abaixo do hero */}
      <div className="max-w-6xl mx-auto px-6 pb-12 space-y-4">
        <div className="ui-card p-4">
          <ImportAppButton />
        </div>
        <ProBanner />
        <PrivacyBanner />
      </div>
    
      {/* Release Notes Dialog */}
      <Dialog open={releaseNotesOpen} onOpenChange={setReleaseNotesOpen}>
        <DialogContent className="max-w-4xl bg-(--docs-bg) pr-0 pt-4 pl-4 gap-1">
          <DialogHeader>
            <DialogTitle>What's new in v{appVersion}?</DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-10 top-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              onClick={() =>
                window.open(
                  releaseUrl.replace("?hideHeader=true&theme=" + theme, ""),
                  "_blank",
                )
              }
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </DialogHeader>
          <div className="overflow-auto h-[70vh] flex flex-col ">
            {releaseUrl && (
              <div className="flex-1">
                <iframe
                  src={releaseUrl}
                  className="w-full h-full border-0 rounded-lg"
                  title={`Release notes for v${appVersion}`}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
