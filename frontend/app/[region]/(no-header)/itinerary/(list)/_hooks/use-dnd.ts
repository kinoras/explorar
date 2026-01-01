import { useState } from 'react'

import {
    DragEndEvent,
    DragOverEvent,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    UniqueIdentifier,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

import type { DailyItinerary } from '@/types/itinerary'

// Converts UniqueIdentifier to string
const toString = (id: UniqueIdentifier) => `${id}`

export const useItineraryDnd = (
    itinerary: DailyItinerary[],
    onReorder: (locationId: string, dayIndex: number, index: number) => void
) => {
    // Currently dragged item (location) id
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor), // Mouse or touch
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }) // Keyboard
    )

    // Check if the given unique id is a day id (i.e., not a location id)
    const isDayUniqueIdentifier = (id: UniqueIdentifier): boolean =>
        itinerary.some((day) => day.date === id)

    // Find the container (day) id for a given item (day or location) id
    const findContainer = (id: UniqueIdentifier): string | undefined =>
        isDayUniqueIdentifier(id)
            ? toString(id) // Day id
            : itinerary.find((day) => day.locations.includes(toString(id)))?.date // Location id

    const handleDragStart = ({ active }: DragStartEvent) => {
        setActiveId(active.id)
    }

    const handleDragOver = ({ active, over }: DragOverEvent) => {
        // No target or same item: do nothing
        if (!over?.id || active.id === over.id) return

        // Find the containers (days) for the active and over items
        const activeContainer = findContainer(active.id)
        const overContainer = findContainer(over.id)

        // Containers not found, or not moving between different containers: do nothing
        if (!activeContainer || !overContainer || activeContainer === overContainer) return

        // Day index and items in the over container
        const overDayIndex = itinerary.findIndex((d) => d.date === overContainer)
        const overItems = itinerary[overDayIndex].locations

        // Reorder items
        if (isDayUniqueIdentifier(over.id)) {
            // 1. Dropped on a container
            onReorder(
                toString(active.id),
                overDayIndex,
                overItems.length // Append to the end
            )
        } else {
            // 2. Dropped on an item
            const isBelowOverItem =
                over &&
                active.rect.current.translated &&
                active.rect.current.translated.top > over.rect.top + over.rect.height

            onReorder(
                toString(active.id),
                overDayIndex,
                overItems.indexOf(toString(over.id)) + (isBelowOverItem ? 1 : 0) // Insert after if below
            )
        }
    }

    const handleDragEnd = ({ active, over }: DragEndEvent) => {
        // No target or same item: do nothing
        if (!over?.id || active.id === over.id) {
            setActiveId(null)
            return
        }

        // Find the containers (days) for the active and over items
        const activeContainer = findContainer(active.id)
        const overContainer = findContainer(over.id)

        // Containers not found or not the same: do nothing
        if (!activeContainer || !overContainer || activeContainer !== overContainer) {
            setActiveId(null)
            return
        }

        // Day index and items in the active container
        const activeDayIndex = itinerary.findIndex((d) => d.date === activeContainer)
        const activeItems = itinerary[activeDayIndex].locations

        // Determine the indices of the active and over items
        const activeIndex = activeItems.indexOf(toString(active.id))
        const overIndex = activeItems.indexOf(toString(over.id))

        // Reorder only if indices are different
        if (activeIndex !== overIndex) {
            onReorder(toString(active.id), activeDayIndex, overIndex)
        }

        setActiveId(null)
    }

    return {
        activeId,
        sensors,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        findContainer
    }
}
