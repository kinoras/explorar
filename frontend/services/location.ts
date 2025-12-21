import { getPlaces } from '@/integrations/client'
import { getPlacesById } from '@/integrations/client'

import type { Location, LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

import { placeToLocation } from './location-utils'

const sortQueryMap = {
    ranking: { orderBy: 'ranking', orderDir: 'asc' },
    rating: { orderBy: 'rating', orderDir: 'desc' }
}

/**
 * Gets locations for a specific region.
 *
 * @param region - The region to fetch locations for
 * @param sort - The field to order by (default: 'ranking')
 * @returns Array of places ordered by the specified field
 */
export const getLocationsByRegion = async (
    region: Region,
    sort: LocationSortOption
): Promise<Location[]> => {
    // Fetch locations of the specified region
    const places = (await getPlaces({ query: { region, ...sortQueryMap[sort] } })).data ?? []

    return places.map(placeToLocation)
}

/**
 * Get a single location by its ID.
 *
 * @param id - The ID of the location to fetch
 * @returns The place with the specified ID or undefined if not found
 */
export const getLocationById = async (id: number): Promise<Location | undefined> => {
    // Fetch place with the specified ID
    const place = (await getPlacesById({ path: { id } })).data

    return place
        ? placeToLocation(place) // Convert to Location object
        : undefined
}
