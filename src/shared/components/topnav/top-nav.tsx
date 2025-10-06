"use client";

import { Menu } from "lucide-react";
import { useAuth } from "@/module/guard";
import { DynamicBreadcrumb } from "@/shared/components/breadcrumb";
import { UserProfile } from "@/shared/components/user-profile";
import { Button } from "@/shared/ui/button";

export default function TopNav() {
  const { user, logout } = useAuth();

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).toggleMenuState) {
      (window as any).toggleMenuState();
    }
  };

  const handleMobileMenuToggle = () => {
    if (typeof window !== "undefined" && (window as any).setIsMobileMenuOpen) {
      const currentState = (window as any).isMobileMenuOpen || false;
      (window as any).setIsMobileMenuOpen(!currentState);
    }
  };

  const generateAvatarUrl = (email: string) => {
    return `https://api.dicebear.com/9.x/dylan/svg?seed=${encodeURIComponent(email)}`;
  };

  const handleSignOut = () => {
    logout();
  };

  return (
    <div className="flex items-center justify-between h-full px-4 lg:px-6">
      {/* Left side - Menu toggle and Breadcrumbs */}
      <div className="flex items-center space-x-4">
        {/* Desktop Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMenuToggle}
          className="hidden lg:flex p-2"
          title="Toggle Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Mobile Menu Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleMobileMenuToggle}
          className="lg:hidden p-2"
          title="Toggle Mobile Menu"
        >
          <Menu className="h-4 w-4" />
        </Button>

        {/* Breadcrumbs Dinámicos */}
        <DynamicBreadcrumb />
      </div>

      {/* Center - Search (hidden on mobile) */}
      <div className="hidden md:flex flex-1 max-w-md mx-4"></div>

      {/* Right side - Actions and Profile */}
      <div className="flex items-center space-x-2">
        {/* Profile Dropdown */}
        <UserProfile
          userName={user?.name || "Usuario"}
          userRole={user?.role === "admin" ? "Administrador" : "Usuario"}
          onSignOut={handleSignOut}
          avatarSrc={user?.email ? generateAvatarUrl(user.email) : undefined}
        />
      </div>
    </div>
  );
}
