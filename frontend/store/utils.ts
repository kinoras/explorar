import { stringToDate } from '@/services/date'

import type { Itinerary } from '@/types/itinerary'
import type { LocationID } from '@/types/location'

/**
 * Create an empty itinerary structure.
 *
 * @param date - The start date of the itinerary in 'YYYY-MM-DD' format
 * @param duration - The number of days for the itinerary
 * @returns An empty Itinerary object
 */
export const createEmptyItinerary = (date?: string, duration: number = 1): Itinerary => ({
    start: stringToDate(date),
    locations: Array.from({ length: duration }, () => [])
})

/**
 * Check if a location is already in the itinerary.
 *
 * @param itinerary - The itinerary to check
 * @param location - The location ID to look for
 * @returns True if the location is in the itinerary, false otherwise
 */
export const isLocationInItinerary = (itinerary: Itinerary, location: LocationID): boolean => {
    return itinerary.locations.some((day) => day.includes(location))
}

/**
 * Merge or adjust daily itineraries to match a target number of days.
 *
 * @param locations - The current daily itineraries
 * @param targetDays - The target number of days for the itinerary
 * @returns The adjusted daily itineraries
 */
export const mergeDailyItineraries = (
    locations: LocationID[][],
    targetDays: number
): LocationID[][] => {
    // Days match or target invalid: Return as is
    if (locations.length === targetDays || isNaN(targetDays) || targetDays <= 0) {
        return locations
    }

    // More days needed: Fill in with empty days
    if (locations.length < targetDays) {
        const additionalDays = targetDays - locations.length
        return [
            ...locations, // Existing days
            ...Array.from({ length: additionalDays }, () => []) // Empty additional days
        ]
    }

    // Fewer days needed: Merge excess days into the last day
    return [
        ...locations.slice(0, targetDays - 1), // The first (n - 1) days
        locations.slice(targetDays - 1).flat() // The n-th day, with the rest days merged into it
    ]
}

/**
 * Add a location to the first day of the itinerary.
 *
 * @param itinerary - The current itinerary
 * @param location - The location ID to add
 * @returns The updated itinerary with the new location added
 */
export const addLocationToItinerary = (
    { locations, ...itinerary }: Itinerary,
    location: LocationID
): Itinerary => {
    const [firstDay, ...restDays] = locations
    return { ...itinerary, locations: [[...firstDay, location], ...restDays] }
}

/**
 * Remove a location from the itinerary.
 *
 * @param itinerary - The current itinerary
 * @param location - The location ID to remove
 * @returns The updated itinerary with the location removed
 */
export const removeLocationFromItinerary = (
    { locations, ...itinerary }: Itinerary,
    location: LocationID
): Itinerary => {
    return {
        ...itinerary,
        locations: locations.map((day) => day.filter((locId) => locId !== location)) // Remove from all days
    }
}
