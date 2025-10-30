import { Link, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import {
  Grid2x2,
  MessageSquare,
  Cog,
  Boxes,
  FolderOpen,
} from "lucide-react";
import { useActiveAccount } from "@/hooks/useActiveAccount";

// Floating navigation bar centered near the bottom.
// Glassmorphism style, rounded, separated buttons.
export function FloatingNav() {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;
  const { activeAccount } = useActiveAccount();
  const [overlayOpen, setOverlayOpen] = useState(false);

  const items = [
    { title: "Apps", to: "/", icon: Grid2x2 },
    { title: "Chat", to: "/chat", icon: MessageSquare },
    { title: "Library", to: "/library", icon: FolderOpen },
    { title: "Hub", to: "/hub", icon: Boxes },
    { title: "Settings", to: "/settings", icon: Cog },
    { title: "Account", to: "/account", icon: Cog }, // fallback if user avatar not available
  ];

  const isActive = (to: string) =>
    (to === "/" && pathname === "/") || (to !== "/" && pathname.startsWith(to));

  const avatarUrl = activeAccount?.avatarUrl || "";
  const avatarLabel = (activeAccount?.name || activeAccount?.email || "").slice(0, 1).toUpperCase();

  return (
    <div className="pointer-events-none fixed bottom-8 left-0 right-0 flex justify-center z-50">
      <div
        className="pointer-events-auto flex items-center gap-2 px-3 py-3 rounded-2xl border border-(--border) bg-white/40 dark:bg-black/30 shadow-xl backdrop-blur-md"
      >
        {/* Left group */}
        <div className="flex items-center gap-2">
          {items.slice(0, 2).map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors border ${
                isActive(item.to)
                  ? "border-(--accent) bg-(--background-lightest) text-(--accent)"
                  : "border-(--border) bg-(--background) hover:bg-(--background-lightest)"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        {/* Center avatar button */}
        <button
          aria-label="User"
          className="h-14 w-14 rounded-full border border-(--border) bg-(--background) hover:bg-(--background-lightest) overflow-hidden shadow-md"
          onClick={() => setOverlayOpen((v) => !v)}
        >
          {avatarUrl ? (
            <img src={avatarUrl} alt="User" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
              {avatarLabel || "U"}
            </div>
          )}
        </button>

        {/* Right group */}
        <div className="flex items-center gap-2">
          {items.slice(2).map((item) => (
            <Link
              key={item.title}
              to={item.to}
              className={`h-12 w-12 rounded-xl flex items-center justify-center transition-colors border ${
                isActive(item.to)
                  ? "border-(--accent) bg-(--background-lightest) text-(--accent)"
                  : "border-(--border) bg-(--background) hover:bg-(--background-lightest)"
              }`}
            >
              <item.icon className="h-5 w-5" />
            </Link>
          ))}
        </div>

        {/* Overlay panel above the nav, when avatar clicked */}
        {overlayOpen && (
          <div className="absolute bottom-[72px] left-1/2 -translate-x-1/2 w-[320px] max-w-[80vw] rounded-2xl border border-(--border) bg-white/60 dark:bg-black/40 backdrop-blur-md shadow-2xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full overflow-hidden border border-(--border)">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="User" className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm text-muted-foreground">
                    {avatarLabel || "U"}
                  </div>
                )}
              </div>
              <div className="text-sm">
                <div className="font-medium">{activeAccount?.name || activeAccount?.email || "Usuário"}</div>
                {activeAccount?.provider ? (
                  <div className="text-muted-foreground">{activeAccount.provider}</div>
                ) : null}
              </div>
            </div>
            <div className="space-y-2">
              <OverlayLink to="/settings">Configurações</OverlayLink>
              <OverlayLink to="/account">Conta</OverlayLink>
              <OverlayLink to="/library">Biblioteca</OverlayLink>
              <OverlayLink to="/hub">Hub</OverlayLink>
              {/* Placeholder for credits section */}
              <div className="mt-2 text-xs text-muted-foreground">
                Créditos: em breve (configuração personalizada)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OverlayLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className="w-full flex items-center justify-between rounded-xl border border-(--border) bg-(--background) hover:bg-(--background-lightest) px-3 py-2 text-sm"
    >
      <span>{children}</span>
      <span className="text-muted-foreground">→</span>
    </Link>
  );
}