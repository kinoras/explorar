'use client'

import type { ComponentProps } from 'react'

import { useRouter } from 'next/navigation'

import { NaviButton } from '@/components/atoms/navi-button'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogTitle
} from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

const EXIT_ANIMATION_DELAY_MS = 200

const ModalLayout = ({ className, children, ...props }: ComponentProps<typeof DialogContent>) => {
    const router = useRouter()

    const handleOpenChange = (open: boolean) => {
        // Go back in history when closing
        if (!open) setTimeout(() => router.back(), EXIT_ANIMATION_DELAY_MS)
    }

    return (
        <Dialog defaultOpen onOpenChange={handleOpenChange}>
            <DialogContent
                showCloseButton={false}
                onOpenAutoFocus={(e) => e.preventDefault()} // Disable auto focus
                className={cn(
                    'max-h-[calc(100dvh-96px)] w-[calc(100vw-18px)] max-w-104!',
                    'block! overflow-y-scroll border-none p-0!',
                    className
                )}
                {...props}
            >
                {children}

                {/* Only to avoid accessibility error/warning.
                    Title and description should be provided by content. */}
                <DialogTitle className="sr-only" />
                <DialogDescription className="sr-only" />
            </DialogContent>
        </Dialog>
    )
}

const ModalCloseButton = () => (
    <DialogClose asChild>
        <NaviButton appearance="close" />
    </DialogClose>
)

export { ModalLayout, ModalCloseButton }
