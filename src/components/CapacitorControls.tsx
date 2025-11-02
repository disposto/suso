import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { IpcClient } from "@/ipc/ipc_client";
import { showSuccess } from "@/lib/toast";
import {
  Smartphone,
  TabletSmartphone,
  Loader2,
  ExternalLink,
  Copy,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CapacitorControlsProps {
  appId: number;
}

type CapacitorStatus = "idle" | "syncing" | "opening";
type ApkStatus = "idle" | "syncing" | "building";

export function CapacitorControls({ appId }: CapacitorControlsProps) {
  const queryClient = useQueryClient();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);
  const [errorDetails, setErrorDetails] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [iosStatus, setIosStatus] = useState<CapacitorStatus>("idle");
  const [androidStatus, setAndroidStatus] = useState<CapacitorStatus>("idle");
  const [apkStatus, setApkStatus] = useState<ApkStatus>("idle");

  // Check if Capacitor is installed
  const { data: isCapacitor, isLoading } = useQuery({
    queryKey: ["is-capacitor", appId],
    queryFn: () => IpcClient.getInstance().isCapacitor({ appId }),
    enabled: appId !== undefined && appId !== null,
  });

  // Detect system platform to guide availability (win32, darwin, linux)
  const { data: systemPlatform } = useQuery({
    queryKey: ["system-platform"],
    queryFn: () => IpcClient.getInstance().getSystemPlatform(),
  });

  const showErrorDialog = (title: string, error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    setErrorDetails({ title, message: errorMessage });
    setErrorDialogOpen(true);
  };

  // Sync and open iOS mutation
  const syncAndOpenIosMutation = useMutation({
    mutationFn: async () => {
      setIosStatus("syncing");
      // If Capacitor is not installed, perform the upgrade automatically
      if (!isCapacitor) {
        await IpcClient.getInstance().executeAppUpgrade({ appId, upgradeId: "capacitor" });
        await queryClient.invalidateQueries({ queryKey: ["is-capacitor", appId] });
      }
      // First sync
      await IpcClient.getInstance().syncCapacitor({ appId });
      setIosStatus("opening");
      // Then open iOS
      await IpcClient.getInstance().openIos({ appId });
    },
    onSuccess: () => {
      setIosStatus("idle");
      showSuccess("Synced and opened iOS project in Xcode");
    },
    onError: (error) => {
      setIosStatus("idle");
      showErrorDialog("Failed to sync and open iOS project", error);
    },
  });

  // Sync and open Android mutation
  const syncAndOpenAndroidMutation = useMutation({
    mutationFn: async () => {
      setAndroidStatus("syncing");
      // If Capacitor is not installed, perform the upgrade automatically
      if (!isCapacitor) {
        await IpcClient.getInstance().executeAppUpgrade({ appId, upgradeId: "capacitor" });
        await queryClient.invalidateQueries({ queryKey: ["is-capacitor", appId] });
      }
      // First sync
      await IpcClient.getInstance().syncCapacitor({ appId });
      setAndroidStatus("opening");
      // Then open Android
      await IpcClient.getInstance().openAndroid({ appId });
    },
    onSuccess: () => {
      setAndroidStatus("idle");
      showSuccess("Synced and opened Android project in Android Studio");
    },
    onError: (error) => {
      setAndroidStatus("idle");
      showErrorDialog("Failed to sync and open Android project", error);
    },
  });

  // Helper function to get button text based on status
  const getIosButtonText = () => {
    switch (iosStatus) {
      case "syncing":
        return { main: "Syncing...", sub: "Building app" };
      case "opening":
        return { main: "Opening...", sub: "Launching Xcode" };
      default:
        return {
          main: "Sync & Open iOS",
          sub: systemPlatform === "darwin" ? "Xcode" : "Disponível apenas no macOS",
        };
    }
  };

  const getAndroidButtonText = () => {
    switch (androidStatus) {
      case "syncing":
        return { main: "Syncing...", sub: "Building app" };
      case "opening":
        return { main: "Opening...", sub: "Launching Android Studio" };
      default:
        return { main: "Sync & Open Android", sub: "Android Studio" };
    }
  };

  const getBuildApkButtonText = () => {
    switch (apkStatus) {
      case "syncing":
        return { main: "Syncing...", sub: "Preparing Android project" };
      case "building":
        return { main: "Building APK...", sub: "Gradle assembleDebug" };
      default:
        return { main: "Build APK (Debug)", sub: "Generate app-debug.apk" };
    }
  };

  // Don't render anything while loading
  if (isLoading) {
    return null;
  }

  const iosButtonText = getIosButtonText();
  const androidButtonText = getAndroidButtonText();
  const buildApkButtonText = getBuildApkButtonText();

  // Build APK mutation
  const buildApkMutation = useMutation({
    mutationFn: async () => {
      setApkStatus("syncing");
      // If Capacitor is not installed, perform the upgrade automatically
      if (!isCapacitor) {
        await IpcClient.getInstance().executeAppUpgrade({ appId, upgradeId: "capacitor" });
        await queryClient.invalidateQueries({ queryKey: ["is-capacitor", appId] });
      }
      // Sync project before build
      await IpcClient.getInstance().syncCapacitor({ appId });
      setApkStatus("building");
      const apkPath = await IpcClient.getInstance().buildApk({ appId });
      return apkPath;
    },
    onSuccess: async (apkPath: string) => {
      setApkStatus("idle");
      showSuccess(`APK built successfully: ${apkPath}`);
      try {
        await IpcClient.getInstance().showItemInFolder(apkPath);
      } catch (err) {
        // Non-fatal if showItemInFolder fails; keep quiet
        console.debug("Failed to show APK in folder:", err);
      }
    },
    onError: (error) => {
      setApkStatus("idle");
      showErrorDialog("Failed to build APK", error);
    },
  });

  return (
    <>
      <Card className="mt-1" data-testid="capacitor-controls">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Mobile Development
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  IpcClient.getInstance().openExternalUrl(
                    "https://dyad.sh/docs/guides/mobile-app#troubleshooting",
                  );
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                Need help?
                <ExternalLink className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  IpcClient.getInstance().openExternalUrl(
                    "https://nodejs.org/en/download/prebuilt-installer",
                  );
                }}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 flex items-center gap-1"
              >
                Install Node v20
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Sync and open your Capacitor mobile projects
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() => syncAndOpenIosMutation.mutate()}
              disabled={syncAndOpenIosMutation.isPending || systemPlatform !== "darwin"}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-10"
              >
              {syncAndOpenIosMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Smartphone className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="text-xs font-medium">{iosButtonText.main}</div>
                <div className="text-xs text-gray-500">{iosButtonText.sub}</div>
              </div>
            </Button>

            <Button
              onClick={() => syncAndOpenAndroidMutation.mutate()}
              disabled={syncAndOpenAndroidMutation.isPending}
              variant="outline"
              size="sm"
              className="flex items-center gap-2 h-10"
            >
              {syncAndOpenAndroidMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TabletSmartphone className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="text-xs font-medium">
                  {androidButtonText.main}
                </div>
                <div className="text-xs text-gray-500">
                  {androidButtonText.sub}
                </div>
              </div>
            </Button>
            <Button
              onClick={() => buildApkMutation.mutate()}
              disabled={buildApkMutation.isPending}
              variant="outline"
              size="sm"
              className="col-span-2 flex items-center gap-2 h-10"
            >
              {buildApkMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <TabletSmartphone className="h-4 w-4" />
              )}
              <div className="text-left">
                <div className="text-xs font-medium">{buildApkButtonText.main}</div>
                <div className="text-xs text-gray-500">{buildApkButtonText.sub}</div>
              </div>
            </Button>
          </div>
          {systemPlatform !== "darwin" && (
            <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
              Nota: abrir o projeto iOS exige macOS + Xcode. No Windows/Linux, use apenas Android.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Error Dialog */}
      <Dialog open={errorDialogOpen} onOpenChange={setErrorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600 dark:text-red-400">
              {errorDetails?.title}
            </DialogTitle>
            <DialogDescription>
              An error occurred while running the Capacitor command. See details
              below:
            </DialogDescription>
          </DialogHeader>

          {errorDetails && (
            <div className="relative">
              <div className="max-h-[50vh] w-full max-w-md rounded border p-4 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono">
                  {errorDetails.message}
                </pre>
              </div>
              <Button
                onClick={() => {
                  navigator.clipboard.writeText(errorDetails.message);
                  showSuccess("Error details copied to clipboard");
                }}
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 h-8 w-8 p-0"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                if (errorDetails) {
                  navigator.clipboard.writeText(errorDetails.message);
                  showSuccess("Error details copied to clipboard");
                }
              }}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copy Error
            </Button>
            <Button
              onClick={() => setErrorDialogOpen(false)}
              variant="outline"
              size="sm"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
