// import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
// import { AppSidebar } from "@/components/app-sidebar";
import { FloatingNav } from "@/components/FloatingNav";
import { ThemeProvider } from "../contexts/ThemeContext";
import { DeepLinkProvider } from "../contexts/DeepLinkContext";
import { Toaster } from "sonner";
import { TitleBar } from "./TitleBar";
import { useEffect } from "react";
import { useRunApp } from "@/hooks/useRunApp";
import { useAtomValue } from "jotai";
import { previewModeAtom } from "@/atoms/appAtoms";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import AuthPage from "@/pages/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { refreshAppIframe } = useRunApp();
  const previewMode = useAtomValue(previewModeAtom);
  const { isAuthenticated } = useSupabaseAuth();
  // Global keyboard listener for refresh events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check for Ctrl+R (Windows/Linux) or Cmd+R (macOS)
      if (event.key === "r" && (event.ctrlKey || event.metaKey)) {
        event.preventDefault(); // Prevent default browser refresh
        if (previewMode === "preview") {
          refreshAppIframe(); // Use our custom refresh function instead
        }
      }
    };

    // Add event listener to document
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove event listener
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [refreshAppIframe, previewMode]);

  return (
    <>
      <ThemeProvider>
        <DeepLinkProvider>
          <div className="theme-apple">
            <TitleBar />
            {/* If not authenticated, render only the Auth screen and avoid mounting app-side components */}
            {isAuthenticated ? (
              <>
                <FloatingNav />
                <div
                  id="layout-main-content-container"
                  className="min-h-screen w-full overflow-x-hidden pt-10 pb-28 border-t border-border bg-background"
                >
                  <div className="w-full">{children}</div>
                </div>
              </>
            ) : (
              <AuthPage />
            )}
            <Toaster richColors />
          </div>
        </DeepLinkProvider>
      </ThemeProvider>
    </>
  );
}
