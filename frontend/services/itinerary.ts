import { useItineraryStore } from '@/store'
import { isLocationInItinerary } from '@/store/utils'

import type { Itinerary } from '@/types/itinerary'
import type { LocationID } from '@/types/location'
import type { Region } from '@/types/region'

/**
 * Hook to manage a specific location in the itinerary for a given region.
 *
 * @param region - The region of the itinerary
 * @param location - The location ID
 * @returns A tuple containing: a boolean indicating if the location is in the itinerary, a function to add the location, and a function to remove the location.
 */
export const useItineraryItem = (
    region: Region,
    location: LocationID
): readonly [boolean, () => void, () => void] => {
    const { itineraries, addLocation, removeLocation } = useItineraryStore()
    return [
        // Whether the location is in the itinerary list
        isLocationInItinerary(itineraries[region], location),
        // Append the location to the itinerary list
        () => addLocation(region, location),
        // Remove the location from the itinerary list
        () => removeLocation(region, location)
    ] as const
}

/**
 * Hook to get the itinerary list for a specific region.
 *
 * @param region - The region of the itinerary list
 * @returns An object containing the itinerary list of location IDs for the specified region.
 */
export const useItineraryList = (region: Region): { itinerary: Itinerary } => {
    const { itineraries } = useItineraryStore()
    return { itinerary: itineraries[region] }
}
