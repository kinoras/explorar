import type { LocationID } from '@/types/location'

export type TransitMethod =
    | 'transit' // Public transport
    | 'driving'
    | 'walking'

export type Route = {
    /** Locations involved in the route */
    locations: {
        /** Origin location */
        origin: LocationID
        /** Destination location */
        destination: LocationID
    }
    /** Transit method used for the route */
    method: TransitMethod
    /** Distance of the route (in meters) */
    distance: number
    /** Duration of the route (in seconds) */
    duration: number
    /** Encoded polyline representing the route */
    polyline?: string
}
