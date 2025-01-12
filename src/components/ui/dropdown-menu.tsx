"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface DropdownMenuItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    onClick?: () => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ children }) => {
    return <div className="relative inline-block text-left">{children}</div>
}

const DropdownMenuTrigger: React.FC<DropdownMenuProps> = ({ children }) => {
    return <div>{children}</div>
}

const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
    children,
    className,
    onClick
}) => {
    return (
        <div
            onClick={onClick}
            className={cn(
                "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
                className
            )}
        >
            {children}
        </div>
    )
}

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuItem } 