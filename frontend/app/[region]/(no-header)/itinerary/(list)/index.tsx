'use client'

import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'

import { DragHandle } from './_components/drag-handle'
import { ItineraryLocation } from './_components/location'
import { locationToItineraryLocationProps } from './_components/location-utils'
import { useItineraryDnd } from './_hooks/use-dnd'
import { ItineraryLayout, ItineraryLayoutSkeleton } from './_layout'
import { ItineraryHeader } from './header'

const ItineraryContent = () => {
    const { region } = useRegion()
    const { itinerary, arrangeLocation } = useItineraryList(region)

    // Fetch details for all locations in the itinerary
    const { locations: details, loading } = useLocations(itinerary.flatMap((day) => day.locations))

    const { activeId, sensors, handleDragStart, handleDragOver, handleDragEnd, findContainer } =
        useItineraryDnd(itinerary, arrangeLocation)

    if (loading) {
        // Show fallback while loading
        return <ItineraryLayoutSkeleton />
    }

    const activeLocation = activeId ? details.find((loc) => loc.id === activeId) : null

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
        >
            <ItineraryLayout itinerary={itinerary} details={details} />
            <DragOverlay>
                {activeLocation && (
                    <div className="after:border-border relative flex after:absolute after:-inset-2.25 after:z-[-1] after:rounded-[20px] after:border after:bg-white">
                        <ItineraryLocation
                            className="flex-1"
                            {...locationToItineraryLocationProps(
                                activeLocation,
                                findContainer(activeId!)! // Date of the container
                            )}
                        />
                        <DragHandle />
                    </div>
                )}
            </DragOverlay>
        </DndContext>
    )
}

export { ItineraryContent, ItineraryHeader }
