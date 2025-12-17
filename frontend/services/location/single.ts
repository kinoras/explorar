import { getPlacesById } from '@/integrations/client'

import { type Location, parseLocation } from './utils'

/**
 * Get a single location by its ID.
 *
 * @param id - The ID of the location to fetch
 * @returns The place with the specified ID or undefined if not found
 */
export const getLocationById = async (id: number): Promise<Location | undefined> => {
    // Fetch location with the specified ID
    const location = (await getPlacesById({ path: { id } })).data

    return !location
        ? undefined // Location not found
        : parseLocation(location)
}
