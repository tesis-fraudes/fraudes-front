"use client";

import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/shared/lib/utils";
import type { MenuItem, SubMenuItem } from "@/shared/routes";
import { useFilteredMenu } from "@/shared/hooks/useFilteredMenu";

type MenuState = "full" | "collapsed" | "hidden";

export default function Sidebar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuState, setMenuState] = useState<MenuState>("full");
  const [isHovered, setIsHovered] = useState(false);
  const [previousDesktopState, setPreviousDesktopState] = useState<MenuState>("full");
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  
  // Usar el menú filtrado basado en permisos
  const filteredMenuData = useFilteredMenu();

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuState((prev) => {
      switch (prev) {
        case "full":
          return "collapsed";
        case "collapsed":
          return "hidden";
        case "hidden":
          return "full";
        default:
          return "full";
      }
    });
  };

  // Function to set menu state from theme customizer
  const setMenuStateFromCustomizer = (state: MenuState) => {
    if (!isMobile) {
      setMenuState(state);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      setIsMobile(!isDesktop);

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState);
          setMenuState("hidden");
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuState(previousDesktopState);
        }
      }
    };

    // Check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  // Export functions to window for TopNav and ThemeCustomizer to access
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).toggleMenuState = toggleMenuState;
      (window as any).menuState = menuState;
      (window as any).isHovered = isHovered;
      (window as any).isMobile = isMobile;
      (window as any).setIsMobileMenuOpen = setIsMobileMenuOpen;
      (window as any).isMobileMenuOpen = isMobileMenuOpen;
      (window as any).setMenuStateFromCustomizer = setMenuStateFromCustomizer;
    }
  }, [
    menuState,
    isHovered,
    isMobile,
    isMobileMenuOpen,
    setMenuStateFromCustomizer,
    toggleMenuState,
  ]);

  function handleNavigation() {
    if (isMobile) {
      setIsMobileMenuOpen(false);
    }
  }

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  function NavItem({
    item,
    level = 0,
    parentId = "",
  }: {
    item: MenuItem | SubMenuItem;
    level?: number;
    parentId?: string;
  }) {
    const itemId = `${parentId}-${item.id}`;
    const isExpanded = expandedItems.has(itemId);
    const hasChildren = item.children && item.children.length > 0;
    const showText =
      menuState === "full" ||
      (menuState === "collapsed" && isHovered) ||
      (isMobile && isMobileMenuOpen);
    const showExpandIcon = hasChildren && showText;

    const paddingLeft = level === 0 ? "px-3" : level === 1 ? "pl-8 pr-3" : "pl-12 pr-3";

    const content = (
      <div
        className={cn(
          "flex items-center py-2 text-sm rounded-md transition-colors sidebar-menu-item hover:bg-gray-800 relative group cursor-pointer",
          paddingLeft
        )}
        onClick={() => {
          if (hasChildren) {
            toggleExpanded(itemId);
          } else if (item.href) {
            // Navigate to the href
            window.location.href = item.href;
            handleNavigation();
          }
        }}
        title={menuState === "collapsed" && !isHovered && !isMobile ? item.label : undefined}
      >
        {item.icon && <item.icon className="h-4 w-4 flex-shrink-0 sidebar-menu-icon !text-white" />}

        {showText && (
          <>
            <span className="ml-3 flex-1 transition-opacity duration-200 sidebar-menu-text !text-white">
              {item.label}
            </span>

            {/* Badges and indicators */}
            <div className="flex items-center space-x-1">
              {item.isNew && (
                <span className="px-1.5 py-0.5 text-xs bg-green-600 text-white rounded-full">
                  New
                </span>
              )}
              {item.badge && (
                <span className="px-1.5 py-0.5 text-xs bg-blue-600 !text-white rounded-full">
                  {item.badge}
                </span>
              )}
              {showExpandIcon && (
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-200 !text-white",
                    isExpanded ? "rotate-180" : "rotate-0"
                  )}
                />
              )}
            </div>
          </>
        )}

        {/* Tooltip for collapsed state when not hovered and not mobile */}
        {menuState === "collapsed" && !isHovered && !isMobile && (
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 !text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
            {item.label}
            {item.badge && <span className="ml-1 text-blue-400">({item.badge})</span>}
          </div>
        )}
      </div>
    );

    return (
      <div>
        {item.href && !hasChildren ? <Link href={item.href}>{content}</Link> : content}
        {hasChildren && isExpanded && showText && (
          <div className="mt-1 space-y-1">
            {item.children?.map((child) => (
              <NavItem key={child.id} item={child} level={level + 1} parentId={itemId} />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Calculate sidebar width - expand when collapsed and hovered, or full width on mobile
  const getSidebarWidth = () => {
    if (isMobile) {
      return "w-64"; // Always full width on mobile
    }
    if (menuState === "collapsed" && isHovered) {
      return "w-64"; // Expand to full width when hovered
    }
    return menuState === "collapsed" ? "w-16" : "w-64";
  };

  // Show text if menu is full OR if collapsed and hovered OR on mobile
  const showText =
    menuState === "full" ||
    (menuState === "collapsed" && isHovered) ||
    (isMobile && isMobileMenuOpen);

  // On mobile, show sidebar as overlay when isMobileMenuOpen is true
  if (isMobile) {
    return (
      <>
        {/* Mobile sidebar overlay */}
        <nav
          className={`
            fixed inset-y-0 left-0 z-[70] w-64 bg-black border-r border-gray-800 transform transition-transform duration-300 ease-in-out
            ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="h-16 px-3 flex items-center border-b border-gray-800">
              <Link href="/model" className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-semibold hover:cursor-pointer text-white">
                  NeuroShield
                </span>
              </Link>
            </div>

            <div
              className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
              style={{
                scrollbarWidth: "none" /* Firefox */,
                msOverflowStyle: "none" /* IE and Edge */,
              }}
            >
              <div className="space-y-6">
                {filteredMenuData.map((section) => (
                  <div key={section.id}>
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label text-gray-400">
                      {section.label}
                    </div>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <NavItem key={item.id} item={item} parentId={section.id} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Mobile overlay backdrop */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black opacity-50 z-[65]"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </>
    );
  }

  // Desktop sidebar
  return (
    <nav
      className={`
        fixed inset-y-0 left-0 z-[60] bg-black border-r border-gray-800 transition-all duration-300 ease-in-out
        ${menuState === "hidden" ? "w-0 border-r-0" : getSidebarWidth()}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        overflow: menuState === "hidden" ? "hidden" : "visible",
      }}
    >
      {menuState !== "hidden" && (
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="h-16 px-3 flex items-center border-b border-gray-800">
            {showText ? (
              <Link
                href="/model"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 w-full"
              >
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
                <span className="text-lg font-semibold hover:cursor-pointer text-white transition-opacity duration-200">
                  NeuroShield
                </span>
              </Link>
            ) : (
              <div className="flex justify-center w-full">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">N</span>
                </div>
              </div>
            )}
          </div>

          <div
            className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 scrollbar-none"
            style={{
              scrollbarWidth: "none" /* Firefox */,
              msOverflowStyle: "none" /* IE and Edge */,
            }}
          >
            <div className="space-y-6">
              {filteredMenuData.map((section) => (
                <div key={section.id}>
                  {showText && (
                    <div className="px-3 mb-2 text-xs font-semibold uppercase tracking-wider sidebar-section-label transition-opacity duration-200 text-gray-400">
                      {section.label}
                    </div>
                  )}
                  <div className="space-y-1">
                    {section.items.map((item) => (
                      <NavItem key={item.id} item={item} parentId={section.id} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
