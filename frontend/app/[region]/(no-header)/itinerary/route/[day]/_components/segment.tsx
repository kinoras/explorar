import type { ComponentProps, ReactNode } from 'react'

import {
    type IconDefinition,
    faArrowsTurnToDots,
    faBusSimple,
    faCar,
    faDollarSign,
    faFerry,
    faPersonWalking,
    faTrainSubway
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Skeleton } from '@/components/ui/skeleton'

import { useRegion } from '@/lib/context'
import { cn } from '@/lib/utils'

import type { Coordinates } from '@/types/location'
import type { Region } from '@/types/region'
import type { TransitMethod, TransitOption } from '@/types/route'

import { RouteDirectionButton, RouteDirectionButtonSkeleton } from './direction-button'

const IconLabel = ({
    icon,
    className,
    children
}: ComponentProps<'span'> & { icon: IconDefinition }) => (
    <p className="flex items-center gap-1 text-xs text-neutral-500">
        <FontAwesomeIcon icon={icon} className={className} />
        <span className="line-clamp-1">{children}</span>
    </p>
)

const methodIcons: Record<TransitMethod | TransitOption, IconDefinition> = {
    bus: faBusSimple,
    rail: faTrainSubway,
    ferry: faFerry,
    transit: faBusSimple,
    driving: faCar,
    walking: faPersonWalking
}

// Pluralization helpers
const formatHours = (hr: number) => (hr <= 1 ? `${hr} hour` : `${hr} hours`)
const formatMinutes = (min: number) => (min <= 1 ? `${min} minute` : `${min} minutes`)

const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.round((seconds % 3600) / 60)

    return hours === 0
        ? formatMinutes(minutes)
        : minutes === 0
          ? formatHours(hours)
          : `${formatHours(hours)} ${formatMinutes(minutes)}`
}

const formatDistance = (meters: number): string => {
    if (meters >= 1000) return `${parseFloat((meters / 1000).toFixed(1))} km` // Kilometers
    return `${meters} m` // Meters
}

const formatFare = (region: Region, value: number): string => {
    switch (region) {
        case 'hk':
            return `HK$ ${value.toFixed(1)}`
        case 'mo':
            return `MOP ${value.toFixed(1)}`
    }
}

const blockStyles = {
    root: 'flex items-center gap-2.5',
    marker: 'mr-1 flex size-6 items-center justify-center rounded-full bg-white ring-6 ring-white',
    content: 'flex flex-1 flex-col gap-0.5'
}

const RouteSegment = ({
    duration,
    distance,
    fare,
    method,
    option,
    origin,
    destination,
    className,
    ...props
}: ComponentProps<'li'> & {
    duration: number
    distance: number
    fare?: number
    method: TransitMethod
    option?: TransitOption
    origin?: Coordinates
    destination?: Coordinates
}) => {
    const { region } = useRegion()
    return (
        <li className={cn(blockStyles.root, className)} {...props}>
            <div className={blockStyles.marker}>
                <FontAwesomeIcon
                    icon={methodIcons[option ?? method]}
                    className="text-theme size-3"
                />
            </div>
            <div className={blockStyles.content}>
                <span className="text-sm font-medium">{formatDuration(duration)}</span>
                <div className="flex gap-1 *:not-last:after:content-['·']">
                    <IconLabel icon={faArrowsTurnToDots}>{formatDistance(distance)}</IconLabel>
                    {fare && (
                        <IconLabel icon={faDollarSign} className="-mx-0.5!">
                            {formatFare(region, fare)}
                        </IconLabel>
                    )}
                </div>
            </div>
            {origin && destination && (
                <RouteDirectionButton origin={origin} destination={destination} method={method} />
            )}
        </li>
    )
}

const RouteSegmentSkeleton = ({ className }: { className?: string }) => (
    <li className={cn(blockStyles.root, className)}>
        <div className={blockStyles.marker}>
            <Skeleton className="size-4 rounded-full" />
        </div>
        <div className={cn(blockStyles.content, 'gap-1.5')}>
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-3 w-1/3" />
        </div>
        <RouteDirectionButtonSkeleton />
    </li>
)

export { RouteSegment, RouteSegmentSkeleton }
