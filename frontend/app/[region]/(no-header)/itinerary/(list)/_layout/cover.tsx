'use client'

import dayjs from 'dayjs'

import { Skeleton } from '@/components/ui/skeleton'

import { useItineraryDuration } from '@/services/itinerary'

import { getAppConfigByRegion } from '@/lib/config'
import { useRegion } from '@/lib/context'
import { cn } from '@/lib/utils'

const DATE_FORMAT = 'MMM D, YYYY'

const formatPeriod = (_start: string, _end: string) => {
    const start = dayjs(_start)
    const end = dayjs(_end)
    return start.isSame(end, 'day')
        ? start.format(DATE_FORMAT)
        : `${start.format(DATE_FORMAT)} -> ${end.format(DATE_FORMAT)}`
}

const ItineraryCover = () => {
    const { region } = useRegion()
    const { name, cover } = getAppConfigByRegion(region)
    const { start, end } = useItineraryDuration(region)

    return (
        <div
            className={cn(
                'relative z-0 h-72 shrink-0',
                'flex flex-col justify-end gap-1.25 p-4.5',
                '**:leading-tight **:text-white'
            )}
        >
            {/* Content */}
            <h1 className="-ml-[0.5px] text-2xl font-bold tracking-[-0.5px] drop-shadow-lg">
                Trip to {name}
            </h1>
            <h2 className="line-clamp-1 text-sm font-medium drop-shadow-lg">
                {formatPeriod(start, end)}
            </h2>

            {/* Background layers */}
            <div className="absolute inset-x-0 bottom-0 -z-5 h-20 bg-linear-to-b to-black/25" />
            <div
                className="absolute inset-0 -z-10 bg-cover bg-center"
                style={{ backgroundImage: `url('${cover}')` }}
            />
        </div>
    )
}

const ItineraryCoverSkeleton = () => {
    return <Skeleton className="h-72 shrink-0" />
}

export { ItineraryCover, ItineraryCoverSkeleton }
