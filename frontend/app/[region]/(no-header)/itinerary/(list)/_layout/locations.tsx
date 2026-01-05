import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import dayjs from 'dayjs'

import { Skeleton } from '@/components/ui/skeleton'

import { Location } from '@/types/location'

import { ItineraryLocationSkeleton } from '../_components/location'
import { locationToItineraryLocationProps } from '../_components/location-utils'
import { ItineraryRouteButton, ItineraryRouteButtonSkeleton } from '../_components/route-button'
import { SortableItineraryLocation } from '../_components/sortable-location'

const blockStyles = {
    root: 'flex flex-col gap-4 px-4.5',
    title: 'grid grid-cols-2 gap-0.75 *:col-start-1',
    button: 'col-start-2! row-span-2 row-start-1 self-center justify-self-end',
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
}) => {
    const { setNodeRef: droppableRef } = useDroppable({ id: date })
    return (
        <div ref={droppableRef} className={blockStyles.root}>
            <div className={blockStyles.title}>
                <h2 className="text-xl font-bold">Day {day}</h2>
                <p className="text-sm leading-tight font-medium text-neutral-500">
                    {dayjs(date).format('MMM D, YYYY (ddd)')}
                </p>
                {locations.length > 0 && (
                    <ItineraryRouteButton
                        className={blockStyles.button}
                        href={`/itinerary/route/${day}`}
                    />
                )}
            </div>
            <SortableContext id={date} items={locations} strategy={verticalListSortingStrategy}>
                <div className={blockStyles.content}>
                    {locations.map((location) => (
                        <SortableItineraryLocation
                            key={location.id}
                            {...locationToItineraryLocationProps(location, date)}
                        />
                    ))}
                </div>
            </SortableContext>
        </div>
    )
}

const ItineraryLocationsSkeleton = ({ itemsCount = 3 }: { itemsCount?: number }) => (
    <div className={blockStyles.root}>
        <div className={blockStyles.title}>
            <Skeleton className="my-px h-6 w-1/2 rounded-md" />
            <Skeleton className="my-px h-4.25 w-2/3 rounded-md" />
            <ItineraryRouteButtonSkeleton className={blockStyles.button} />
        </div>
        <div className={blockStyles.content}>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <ItineraryLocationSkeleton key={index} />
            ))}
        </div>
    </div>
)

export { ItineraryLocations, ItineraryLocationsSkeleton }
