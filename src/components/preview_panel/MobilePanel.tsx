import { useAtomValue } from "jotai";
import { useEffect, useState } from "react";
import { selectedAppIdAtom } from "@/atoms/appAtoms";
import { selectedChatIdAtom } from "@/atoms/chatAtoms";
import { CapacitorControls } from "@/components/CapacitorControls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { IpcClient } from "@/ipc/ipc_client";
import { useQuery } from "@tanstack/react-query";
import { useMobileCredits } from "@/hooks/useMobileCredits";
import iphoneMock from "../../assets/phones/iphone_14.svg";
import androidMock from "../../assets/phones/android_s25ultra.svg";
import { showError } from "@/lib/toast";
import { Smartphone, DollarSign, CreditCard, Users, Lock } from "lucide-react";

export const MobilePanel = () => {
  const selectedAppId = useAtomValue(selectedAppIdAtom);
  const selectedChatId = useAtomValue(selectedChatIdAtom);
  const { mobileCredits } = useMobileCredits();

  const { data: selectedChat } = useQuery({
    queryKey: ["chat", selectedChatId],
    enabled: Boolean(selectedChatId),
    queryFn: async () => {
      return await IpcClient.getInstance().getChat(selectedChatId!);
    },
    staleTime: 15_000,
    meta: { showErrorToast: true },
  });

  type MobileConfig = {
    platform: "android" | "ios";
    showAds: boolean;
    showIap: boolean;
    showSubscriptions: boolean;
    showLogin: boolean;
    previewImageDataUrl?: string;
  };

  const storageKey = selectedAppId ? `mobile-config:${selectedAppId}` : null;
  const initialConfig: MobileConfig = (() => {
    if (!storageKey) return {
        platform: "android",
        showAds: false,
        showIap: false,
        showSubscriptions: false,
        showLogin: false,
      };
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return {
        platform: "android",
        showAds: false,
        showIap: false,
        showSubscriptions: false,
        showLogin: false,
      };
      const parsed = JSON.parse(raw);
      return {
        platform: parsed.platform === "ios" ? "ios" : "android",
        showAds: Boolean(parsed.showAds),
        showIap: Boolean(parsed.showIap),
        showSubscriptions: Boolean(parsed.showSubscriptions),
        showLogin: Boolean(parsed.showLogin),
        previewImageDataUrl: typeof parsed.previewImageDataUrl === "string" ? parsed.previewImageDataUrl : undefined,
      } as MobileConfig;
    } catch {
      return {
        platform: "android",
        showAds: false,
        showIap: false,
        showSubscriptions: false,
        showLogin: false,
      };
    }
  })();

  const [config, setConfig] = useState<MobileConfig>(initialConfig);

  // Auto-save config to localStorage
  useEffect(() => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(config));
    } catch (err) {
      console.error("Failed to save mobile config", err);
    }
  }, [config, storageKey]);

  const onUploadPreview = async (file: File | null) => {
    if (!file) return;
    const allowedTypes = ["image/png", "image/jpeg"];
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (!allowedTypes.includes(file.type)) {
      showError("Formato inválido. Use PNG ou JPEG.");
      return;
    }
    if (file.size > maxSize) {
      showError("Arquivo muito grande. Máximo 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      setConfig((prev) => ({ ...prev, previewImageDataUrl: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  if (!selectedAppId) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-900/30 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-gray-600 dark:text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Nenhum app selecionado
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-md">
          Selecione um app para converter para iOS/Android.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 space-y-4">
        {selectedChat && selectedChat.purpose !== "mobile-config" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">Mobile Config</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Para configurar recursos mobile (Ads, IAP, Subscriptions) e ver o preview do mock do telefone, abra o chat de Mobile Config.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  if (!selectedAppId) return;
                  try {
                    const chatId = await IpcClient.getInstance().createMobileConfigChat(selectedAppId);
                    // Navigation is handled in ChatHeader; here we just inform.
                    showError("Mobile Config chat criado/aberto. Use o cabeçalho do Chat para navegar.");
                  } catch (err) {
                    showError(err);
                  }
                }}
              >
                Abrir Mobile Config Chat
              </Button>
            </CardContent>
          </Card>
        )}
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Mobile Apps
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sincronize e abra seu projeto mobile com Capacitor (Android Studio / Xcode).
          </p>
        </div>

        <CapacitorControls appId={selectedAppId} />

        {/* Mobile Config UI */}
        {selectedChat?.purpose === "mobile-config" && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">Configurações Mobile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm">Plataforma de preview</label>
                <div className="flex gap-2">
                  <Button
                    variant={config.platform === "android" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig((p) => ({ ...p, platform: "android" }))}
                  >
                    Android
                  </Button>
                  <Button
                    variant={config.platform === "ios" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfig((p) => ({ ...p, platform: "ios" }))}
                  >
                    iOS
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4 text-blue-600" />
                    <label className="text-sm font-medium">Recursos Premium</label>
                  </div>
                  
                  {/* Ads Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      <div>
                        <div className="text-sm font-medium">Ads</div>
                        <div className="text-xs text-muted-foreground">Monetização com anúncios</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(mobileCredits?.balance ?? 0) <= 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      <Switch
                        checked={config.showAds}
                        onCheckedChange={(checked) => setConfig((p) => ({ ...p, showAds: checked }))}
                        disabled={(mobileCredits?.balance ?? 0) <= 0}
                      />
                    </div>
                  </div>

                  {/* IAP Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-4 w-4 text-blue-600" />
                      <div>
                        <div className="text-sm font-medium">In-App Purchases</div>
                        <div className="text-xs text-muted-foreground">Compras dentro do app</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(mobileCredits?.balance ?? 0) <= 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      <Switch
                        checked={config.showIap}
                        onCheckedChange={(checked) => setConfig((p) => ({ ...p, showIap: checked }))}
                        disabled={(mobileCredits?.balance ?? 0) <= 0}
                      />
                    </div>
                  </div>

                  {/* Subscriptions Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-purple-600" />
                      <div>
                        <div className="text-sm font-medium">Subscriptions</div>
                        <div className="text-xs text-muted-foreground">Assinaturas recorrentes</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(mobileCredits?.balance ?? 0) <= 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      <Switch
                        checked={config.showSubscriptions}
                        onCheckedChange={(checked) => setConfig((p) => ({ ...p, showSubscriptions: checked }))}
                        disabled={(mobileCredits?.balance ?? 0) <= 0}
                      />
                    </div>
                  </div>

                  {/* Login Switch */}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Lock className="h-4 w-4 text-orange-600" />
                      <div>
                        <div className="text-sm font-medium">Login/Auth</div>
                        <div className="text-xs text-muted-foreground">Sistema de autenticação</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(mobileCredits?.balance ?? 0) <= 0 && (
                        <Badge variant="secondary" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Pro
                        </Badge>
                      )}
                      <Switch
                        checked={config.showLogin || false}
                        onCheckedChange={(checked) => setConfig((p) => ({ ...p, showLogin: checked }))}
                        disabled={(mobileCredits?.balance ?? 0) <= 0}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Preview do app (PNG/JPEG ≤ 5MB)</label>
                  <input
                    type="file"
                    accept="image/png,image/jpeg"
                    onChange={(e) => onUploadPreview(e.target.files?.[0] ?? null)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm">Ações</label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => IpcClient.getInstance().openExternalUrl("https://capacitorjs.com/docs")}
                    >
                      Docs Capacitor
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => IpcClient.getInstance().openExternalUrl("https://developers.google.com/admob")}
                    >
                      Docs AdMob
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Smartphone className="h-4 w-4 text-blue-600" />
                  <label className="text-sm font-medium">Preview Mobile</label>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-6 rounded-lg">
                  <div className="relative w-full max-w-xs mx-auto">
                    <img
                      src={config.platform === "ios" ? iphoneMock : androidMock}
                      alt={`${config.platform === "ios" ? "iPhone" : "Android"} mockup`}
                      className="w-full h-auto block drop-shadow-2xl"
                    />
                    {config.previewImageDataUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <img
                          src={config.previewImageDataUrl}
                          alt="App preview"
                          className="w-[65%] h-auto rounded-lg shadow-lg object-cover"
                          style={{
                            maxHeight: config.platform === "ios" ? "75%" : "70%"
                          }}
                        />
                      </div>
                    )}
                    {!config.previewImageDataUrl && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[65%] bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center text-center p-4"
                             style={{
                               height: config.platform === "ios" ? "75%" : "70%"
                             }}>
                          <div className="text-gray-500 dark:text-gray-400">
                            <Smartphone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                            <p className="text-xs">Faça upload de uma imagem para ver o preview</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center mt-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {config.platform === "ios" ? "iPhone 14" : "Samsung Galaxy S25 Ultra"}
                    </p>
                    <div className="flex justify-center gap-2 mt-2">
                      {config.showAds && <Badge variant="outline" className="text-xs">Ads</Badge>}
                      {config.showIap && <Badge variant="outline" className="text-xs">IAP</Badge>}
                      {config.showSubscriptions && <Badge variant="outline" className="text-xs">Subs</Badge>}
                      {config.showLogin && <Badge variant="outline" className="text-xs">Auth</Badge>}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2">
              Monetização (Ads)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Para monetizar, você pode integrar redes de anúncios como AdMob nas builds Android/iOS.
              Siga a documentação oficial e adicione os SDKs diretamente no projeto mobile aberto.
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => IpcClient.getInstance().openExternalUrl("https://capacitorjs.com/docs")}
              >
                Docs Capacitor
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => IpcClient.getInstance().openExternalUrl("https://developers.google.com/admob")}
              >
                Docs AdMob
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};