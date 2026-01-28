import { computeRoutes as _computeRoutes } from '@/integrations/client'
import {
    isPostRoutesInvalidDateFormatError,
    isPostRoutesNotInSameRegionError,
    isPostRoutesOnlyOnePlaceError,
    isPostRoutesPlaceNotFoundError,
    isPostRoutesSearchingPastDatesError
} from '@/integrations/errors'

import { AppError } from '@/lib/errors'
import { hasErrorMessage, isPresent } from '@/lib/utils'

import type { LocationID } from '@/types/location'
import type { Route, TransitMethod } from '@/types/route'

import { processRoutesResult, transitMethodToTravelMode } from './route-utils'

/**
 * Compute routes for a given day
 *
 * @param date - ISO date string
 * @param method - Transit method
 * @param locations - List of waypoint location IDs
 * @returns Promise resolving to an array of Route objects
 */
export const computeRoutes = async (
    date: string,
    method: TransitMethod,
    locations: LocationID[]
): Promise<Route[]> => {
    // Fetch route data from the API
    const { data: route, error } = await _computeRoutes({
        body: {
            date,
            mode: transitMethodToTravelMode(method),
            places: locations
        }
    })

    if (error) {
        const errorMessage = hasErrorMessage(error) ? error.message : String(error)

        // Domain-specific error handling
        if (isPostRoutesInvalidDateFormatError(error))
            throw new AppError('INVALID_DATE_FORMAT', errorMessage)
        if (isPostRoutesSearchingPastDatesError(error))
            throw new AppError('INVALID_DATE_RANGE', errorMessage)
        if (isPostRoutesNotInSameRegionError(error))
            throw new AppError('INVALID_LOCATION_PAIRS', errorMessage)
        if (isPostRoutesPlaceNotFoundError(error))
            throw new AppError('LOCATION_NOT_FOUND', errorMessage)
        if (isPostRoutesOnlyOnePlaceError(error))
            // No need to handle, empty response is enough
            return []

        // General error
        throw new AppError('UNKNOWN', errorMessage)
    }

    return (route?.routes ?? [])
        .map(processRoutesResult) // Convert to Route objects
        .filter(isPresent) // Filter out undefined entries
}
