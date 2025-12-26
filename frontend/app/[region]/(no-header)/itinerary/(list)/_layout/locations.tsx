import dayjs from 'dayjs'

import { Skeleton } from '@/components/ui/skeleton'

import { Location } from '@/types/location'

import { ItineraryLocation, ItineraryLocationSkeleton } from '../_components/location'

const blockStyles = {
    root: 'flex flex-col gap-4 px-4.5',
    title: 'flex flex-col gap-0.75',
    content: 'flex flex-col gap-4.5'
}

const ItineraryLocations = ({
    day,
    date,
    locations
}: {
    /** The day number in the itinerary. */
    day: number
    /** The date string. */
    date: string
    /** The list of locations for the day. */
    locations: Location[]
}) => (
    <div className={blockStyles.root}>
        <div className={blockStyles.title}>
            <h2 className="text-xl font-bold">Day {day}</h2>
            <p className="text-sm leading-tight font-medium text-neutral-500">
                {dayjs(date).format('MMM D, YYYY (ddd)')}
            </p>
        </div>
        <div className={blockStyles.content}>
            {locations.map(({ id, name, position, hours, images }) => (
                <ItineraryLocation
                    key={id}
                    identifier={id}
                    image={images[0]}
                    name={name}
                    address={position.address}
                    hours={!hours ? 'Open 24 hours' : hours[dayjs(date).day()]?.formatted}
                />
            ))}
        </div>
    </div>
)

const ItineraryLocationsSkeleton = ({ itemsCount = 3 }: { itemsCount?: number }) => (
    <div className={blockStyles.root}>
        <div className={blockStyles.title}>
            <Skeleton className="my-px h-6 w-1/4 rounded-md" />
            <Skeleton className="my-px h-4.25 w-1/3 rounded-md" />
        </div>
        <div className={blockStyles.content}>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <ItineraryLocationSkeleton key={index} />
            ))}
        </div>
    </div>
)

export { ItineraryLocations, ItineraryLocationsSkeleton }
