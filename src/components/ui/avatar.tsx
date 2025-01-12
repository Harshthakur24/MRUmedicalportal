"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import Image from 'next/image'

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    src?: string;
    alt?: string;
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, src, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
                className
            )}
            {...props}
        >
            {src ? (
                <Image
                    width={64}
                    height={64}
                    alt={"avatar"}
                    src={src}
                    referrerPolicy="no-referrer"
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center rounded-full bg-muted">
                    {props.children}
                </div>
            )}
        </div>
    )
)
Avatar.displayName = "Avatar"

export { Avatar } 