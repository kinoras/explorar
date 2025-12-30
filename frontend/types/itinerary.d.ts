import type { LocationID } from '@/types/location'

type DailyItinerary = LocationID[]

export type Itinerary = {
    /** The start date of the itinerary in ISO format */
    start: string
    /** Lists of location IDs for each day */
    locations: DailyItinerary[]
}
