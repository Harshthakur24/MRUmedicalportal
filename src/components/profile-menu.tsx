"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { LogOut, User } from "lucide-react"
import { Loader2 } from "lucide-react"

interface ProfileMenuProps {
    user: {
        name?: string | null
        email?: string | null
        role?: string | null
    }
}

export function ProfileMenu({ user }: ProfileMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [])

    const handleSignOut = async () => {
        try {
            setIsLoading(true)
            await signOut()
        } catch (error) {
            console.error("Error signing out:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative" ref={menuRef}>
            <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <User className="h-4 w-4" />
            </Button>
            <div
                className={`absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md transition-all duration-200 ${isOpen
                    ? "visible scale-100 opacity-100"
                    : "invisible scale-95 opacity-0"
                    }`}
            >
                <div className="p-2">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </div>
                <div className="h-px bg-muted" />
                <button
                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-50"
                    onClick={handleSignOut}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {isLoading ? "Signing out..." : "Log out"}
                </button>
            </div>
        </div>
    )
} 