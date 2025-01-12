"use client"

import { signOut } from "next-auth/react"
import { User } from "@prisma/client"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

interface ProfileButtonProps {
    user: User
}

export function ProfileButton({ user }: ProfileButtonProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <Button
                variant="outline"
                className="relative h-8 w-8 rounded-full"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-medium">{user.name?.[0]?.toUpperCase()}</span>
            </Button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-1 text-popover-foreground shadow-md">
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
                        className="relative flex w-full cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                        onClick={() => signOut()}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log out
                    </button>
                </div>
            )}
        </div>
    )
} 