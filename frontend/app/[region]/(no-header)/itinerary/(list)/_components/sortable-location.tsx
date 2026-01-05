import type { ComponentProps } from 'react'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { cn } from '@/lib/utils'

import { DragHandle } from './drag-handle'
import { ItineraryLocation } from './location'

const SortableItineraryLocation = ({
    identifier,
    ...props
}: ComponentProps<typeof ItineraryLocation>) => {
    const {
        attributes,
        listeners,
        setNodeRef: sortableRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: identifier })

    return (
        <div
            ref={sortableRef}
            className="flex"
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0 : 1
            }}
        >
            <ItineraryLocation identifier={identifier} className="flex-1" {...props} />
            <DragHandle {...attributes} {...listeners} />
        </div>
    )
}

const SortableItineraryLocationOverlay = ({
    identifier,
    ...props
}: ComponentProps<typeof ItineraryLocation>) => {
    return (
        <div
            className={cn(
                'flex',
                'relative after:absolute after:-inset-2.25 after:z-[-1]', // Background positioning
                'after:border-border after:rounded-[20px] after:border after:bg-white' // Background styles
            )}
        >
            <ItineraryLocation identifier={identifier} className="flex-1" {...props} />
            <DragHandle />
        </div>
    )
}

export { SortableItineraryLocation, SortableItineraryLocationOverlay }
