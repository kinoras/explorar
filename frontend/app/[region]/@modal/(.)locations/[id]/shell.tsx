'use client'

import type { ComponentProps } from 'react'

import { useRouter } from 'next/navigation'

import { Dialog } from '@/components/ui/dialog'

const LocationModalShell = ({ ...props }: ComponentProps<typeof Dialog>) => {
    const router = useRouter()

    const handleOpenChange = (open: boolean) => {
        // Go back in history when closing
        if (!open) setTimeout(() => router.back(), 200) // Animation delay
    }

    return <Dialog defaultOpen onOpenChange={handleOpenChange} {...props} />
}

export { LocationModalShell }
