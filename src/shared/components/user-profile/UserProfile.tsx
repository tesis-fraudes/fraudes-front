"use client";

import { ChevronDown, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";

interface UserProfileProps {
  userName?: string;
  userRole?: string;
  avatarSrc?: string;
  onSignOut?: () => void;
}

export default function UserProfile({
  userName = "John Doe",
  userRole = "Administrator",
  avatarSrc = "/placeholder.svg?height=32&width=32",
  onSignOut,
}: UserProfileProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={avatarSrc} alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="hidden lg:flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{userName}</span>
            <span className="text-xs text-gray-500">{userRole}</span>
          </div>
          <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600" onClick={onSignOut}>
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
