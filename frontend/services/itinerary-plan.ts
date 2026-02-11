import { planItinerary as _planItinerary } from '@/integrations/client/sdk.gen'
import { getErrorCode, getErrorMessage } from '@/integrations/errors'

import { AppError } from '@/lib/errors'

import type { LocationID } from '@/types/location'

/**
 * Plans the itinerary by optimizing the order of locations
 *
 * @param start - Itinerary start date in ISO date string
 * @param duration - Trip duration in days
 * @param locations - List of location IDs to visit
 * @returns Promise resolving to the planned itinerary
 */
export const planItinerary = async (
    start: string,
    duration: number,
    locations: LocationID[]
): Promise<LocationID[][]> => {
    const { data, error } = await _planItinerary({
        body: {
            start_date: start,
            duration,
            places: locations
        }
    })

    if (error) {
        const errorCode = getErrorCode(error)
        const errorMessage = getErrorMessage(error) ?? String(error)

        // Domain-specific error handling
        if (errorCode === 'itinerary.date.format')
            throw new AppError('INVALID_DATE_FORMAT', errorMessage)
        // if (errorCode === 'itinerary.duration.invalid')
        //     throw new AppError('UNKNOWN', errorMessage)
        if (errorCode === 'itinerary.places.notFound')
            throw new AppError('LOCATION_NOT_FOUND', errorMessage)
        if (errorCode === 'itinerary.places.regions')
            // Locations not in the same region
            throw new AppError('INVALID_LOCATION_PAIRS', errorMessage)
        if (errorCode === 'itinerary.places.format')
            // Empty list: No need to handle, empty response is enough
            return Array.from({ length: duration }, () => [])

        // General error
        throw new AppError('UNKNOWN', errorMessage)
    }

    // Initialize itinerary
    const itinerary = Array.from({ length: duration }, () => []) as LocationID[][]

    // Populate itinerary based on server response
    data.plan.forEach((dayPlan) => {
        // Convert index with bounds checking
        const dayIndex = Math.min(Math.max(1, dayPlan.day), duration) - 1 // Zero-based
        // Assign the places to the specific day
        itinerary[dayIndex].push(...dayPlan.places)
    })

    return itinerary
}
