import { postRoutesDay } from '@/integrations/client'

import { isPresent } from '@/lib/utils'

import type { LocationID } from '@/types/location'
import type { Route, TransitMethod } from '@/types/route'

import { routeLegToRoute, transitMethodToTravelMode } from './route-utils'

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
    const route = await postRoutesDay({
        body: {
            date,
            mode: transitMethodToTravelMode(method),
            placeIds: locations.map(Number)
        }
    })

    return (route.data?.legs ?? [])
        .map(routeLegToRoute) // Convert to Route objects
        .filter(isPresent) // Filter out undefined entries
}
