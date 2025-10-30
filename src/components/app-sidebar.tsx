import {
  Grid2x2,
  MessageSquare,
  Cog,
  LifeBuoy,
  Boxes,
  FolderOpen,
  User,
} from "lucide-react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useSidebar } from "@/components/ui/sidebar"; // import useSidebar hook
import { useEffect, useState, useRef } from "react";
import { useAtom } from "jotai";
import { dropdownOpenAtom } from "@/atoms/uiAtoms";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ChatList } from "./ChatList";
import { AppList } from "./AppList";
import { HelpDialog } from "./HelpDialog"; // Import the new dialog
import { SettingsList } from "./SettingsList";

// Menu items.
const items = [
  {
    title: "Apps",
    to: "/",
    icon: Grid2x2,
  },
  {
    title: "Chat",
    to: "/chat",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    to: "/settings",
    icon: Cog,
  },
  {
    title: "Account",
    to: "/account",
    icon: User,
  },
  {
    title: "Library",
    to: "/library",
    icon: FolderOpen,
  },
  {
    title: "Hub",
    to: "/hub",
    icon: Boxes,
  },
];

// Hover state types
type HoverState =
  | "start-hover:app"
  | "start-hover:chat"
  | "start-hover:settings"
  | "start-hover:library"
  | "clear-hover"
  | "no-hover";

export function AppSidebar() {
  const { state, toggleSidebar } = useSidebar(); // retrieve current sidebar state
  const [hoverState, setHoverState] = useState<HoverState>("no-hover");
  const expandedByHover = useRef(false);
  const [isHelpDialogOpen, setIsHelpDialogOpen] = useState(false); // State for dialog
  const [isDropdownOpen] = useAtom(dropdownOpenAtom);

  useEffect(() => {
    if (hoverState.startsWith("start-hover") && state === "collapsed") {
      expandedByHover.current = true;
      toggleSidebar();
    }
    if (
      hoverState === "clear-hover" &&
      state === "expanded" &&
      expandedByHover.current &&
      !isDropdownOpen
    ) {
      toggleSidebar();
      expandedByHover.current = false;
      setHoverState("no-hover");
    }
  }, [hoverState, toggleSidebar, state, setHoverState, isDropdownOpen]);

  const routerState = useRouterState();
  const isAppRoute =
    routerState.location.pathname === "/" ||
    routerState.location.pathname.startsWith("/app-details");
  const isChatRoute = routerState.location.pathname === "/chat";
  const isSettingsRoute = routerState.location.pathname.startsWith("/settings");

  let selectedItem: string | null = null;
  if (hoverState === "start-hover:app") {
    selectedItem = "Apps";
  } else if (hoverState === "start-hover:chat") {
    selectedItem = "Chat";
  } else if (hoverState === "start-hover:settings") {
    selectedItem = "Settings";
  } else if (hoverState === "start-hover:library") {
    selectedItem = "Library";
  } else if (state === "expanded") {
    if (isAppRoute) {
      selectedItem = "Apps";
    } else if (isChatRoute) {
      selectedItem = "Chat";
    } else if (isSettingsRoute) {
      selectedItem = "Settings";
    }
  }

  return (
    <Sidebar
      collapsible="icon"
      onMouseLeave={() => {
        if (!isDropdownOpen) {
          setHoverState("clear-hover");
        }
      }}
    >
      <SidebarContent className="overflow-hidden">
        <div className="flex mt-8">
          {/* Left Column: Menu items */}
          <div className="">
            <SidebarTrigger
              onMouseEnter={() => {
                setHoverState("clear-hover");
              }}
            />
            <AppIcons onHoverChange={setHoverState} />
          </div>
          {/* Right Column: Chat List Section */}
          <div className="w-[240px]">
            <AppList show={selectedItem === "Apps"} />
            <ChatList show={selectedItem === "Chat"} />
            <SettingsList show={selectedItem === "Settings"} />
          </div>
        </div>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* Change button to open dialog instead of linking */}
            <SidebarMenuButton
              size="sm"
              className="font-medium w-12 h-12 mb-2 rounded-lg flex items-center justify-center"
              onClick={() => setIsHelpDialogOpen(true)} // Open dialog on click
            >
              <LifeBuoy className="h-4 w-4" />
            </SidebarMenuButton>
            <HelpDialog
              isOpen={isHelpDialogOpen}
              onClose={() => setIsHelpDialogOpen(false)}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

function AppIcons({
  onHoverChange,
}: {
  onHoverChange: (state: HoverState) => void;
}) {
  const routerState = useRouterState();
  const pathname = routerState.location.pathname;

  return (
    // When collapsed: only show the main menu
    <SidebarGroup className="pr-0">
      {/* <SidebarGroupLabel>Dyad</SidebarGroupLabel> */}

      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive =
              (item.to === "/" && pathname === "/") ||
              (item.to !== "/" && pathname.startsWith(item.to));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  className="font-medium w-12"
                >
                  <Link
                    to={item.to}
                    className={`flex items-center justify-center h-12 mb-2 rounded-lg border ${
                      isActive
                        ? "border-(--accent) bg-(--background-lightest) text-(--accent)"
                        : "border-(--border) bg-(--background) hover:bg-(--background-lightest)"
                    } transition-colors`}
                  onMouseEnter={() => {
                    if (item.title === "Apps") {
                      onHoverChange("start-hover:app");
                    } else if (item.title === "Chat") {
                      onHoverChange("start-hover:chat");
                    } else if (item.title === "Settings") {
                      onHoverChange("start-hover:settings");
                    } else if (item.title === "Library") {
                      onHoverChange("start-hover:library");
                    }
                  }}
                >
                  <item.icon className="h-4 w-4" />
                </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
