import type { ComponentProps } from 'react'

import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

const markerStyles = ''

const RouteMapMarker = ({
    size,
    className,
    ...props
}: ComponentProps<'span'> & { size: 'sm' | 'md' }) => (
    <span
        className={cn(
            'flex items-center justify-center', // Layout
            'rounded-full bg-black font-bold text-white tabular-nums ring-2 ring-white', // Appearance
            // Size variants
            size === 'sm' && 'size-4.5 text-xs',
            size === 'md' && 'size-6 text-sm',
            className
        )}
        {...props}
    />
)

const RouteMapMarkerSkeleton = ({
    size,
    className,
    ...props
}: ComponentProps<typeof Skeleton> & { size: 'sm' | 'md' }) => (
    <Skeleton
        className={cn(
            'rounded-full ring-2 ring-white',
            // Size variants
            size === 'sm' && 'size-4.5',
            size === 'md' && 'size-6',
            className
        )}
        {...props}
    />
)

export { RouteMapMarker, RouteMapMarkerSkeleton }
