'use client'

import type { ComponentProps } from 'react'

import { useRouter } from 'next/navigation'

import { NaviButton } from '@/components/atoms/navi-button'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetTitle
} from '@/components/ui/sheet'

import { cn } from '@/lib/utils'

const EXIT_ANIMATION_DELAY_MS = 200

const SheetLayout = ({ className, children, ...props }: ComponentProps<typeof SheetContent>) => {
    const router = useRouter()

    const handleOpenChange = (open: boolean) => {
        // Go back in history when closing
        if (!open) setTimeout(() => router.back(), EXIT_ANIMATION_DELAY_MS)
    }

    return (
        <Sheet defaultOpen onOpenChange={handleOpenChange}>
            <SheetContent
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()} // Disable auto focus
                className={cn(
                    'mx-auto h-[calc(100dvh-24px)] max-w-md border-t-0',
                    'gap-0 overflow-y-scroll rounded-tl-3xl rounded-tr-3xl',
                    className
                )}
                {...props}
            >
                {children}

                {/* Only to avoid accessibility error/warning.
                    Title and description should be provided by content. */}
                <SheetTitle className="sr-only" />
                <SheetDescription className="sr-only" />
            </SheetContent>
        </Sheet>
    )
}
const SheetCloseButton = () => (
    <SheetClose asChild>
        <NaviButton appearance="close" />
    </SheetClose>
)

export { SheetLayout, SheetCloseButton }
