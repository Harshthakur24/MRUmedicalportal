"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface LogoutButtonProps {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  className?: string;
  showIcon?: boolean;
}

export function LogoutButton({
  variant = "default",
  className = "",
  showIcon = true,
}: LogoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      await signOut({
        redirect: false,
        callbackUrl: "/auth/login",
      });
      router.push("/auth/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={variant as "default" | "destructive" | "outline" | undefined}
      className={className}
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          Logging out...
        </span>
      ) : (
        <span className="flex items-center gap-2">
          {showIcon && <LogOut className="h-4 w-4" />}
          Logout
        </span>
      )}
    </Button>
  );
}
