import type { ComponentProps } from 'react'

import { cn, isPresent } from '@/lib/utils'

import type { DailyItinerary } from '@/types/itinerary'
import type { Location } from '@/types/location'

import { ItineraryLocations, ItineraryLocationsSkeleton } from './locations'

const blockStyles = {
    root: '',
    content: 'mt-5 mb-6 flex flex-col gap-7',
    spacer: 'flex-1 basis-2'
}

const ItineraryLayout = ({
    itinerary,
    details,
    className,
    ...props
}: ComponentProps<'div'> & {
    itinerary: DailyItinerary[]
    details: Location[]
}) => (
    <div className={cn(blockStyles.root, className)} {...props}>
        <div className={blockStyles.content}>
            {itinerary.map(({ date, locations }, index) => (
                <ItineraryLocations
                    key={date}
                    day={index + 1}
                    date={date}
                    locations={locations
                        .map((locId) => details.find((loc) => loc.id === locId))
                        .filter(isPresent)}
                />
            ))}
        </div>
    </div>
)

const ItineraryLayoutSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn(blockStyles.root, className)} {...props}>
        <div className={blockStyles.content}>
            <ItineraryLocationsSkeleton itemsCount={2} />
            <ItineraryLocationsSkeleton itemsCount={2} />
        </div>
    </div>
)

export { ItineraryLayout, ItineraryLayoutSkeleton }
