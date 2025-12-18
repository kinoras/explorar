'use client'

import type { ComponentProps } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog } from '@/components/ui/dialog'

/** Modal closing animation delay. */
const ANIMATION_DELAY_MS = 200

const LocationModalShell = ({ ...props }: ComponentProps<typeof Dialog>) => {
    const router = useRouter()

    const handleOpenChange = (open: boolean) => {
        // Go back in history when closing
        if (!open) setTimeout(() => router.back(), ANIMATION_DELAY_MS)
    }

    return <Dialog defaultOpen onOpenChange={handleOpenChange} {...props} />
}

export { LocationModalShell }
