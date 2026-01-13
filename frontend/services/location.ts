import { getPlaces } from '@/integrations/client'
import { getPlacesById } from '@/integrations/client'

import type { Location, LocationID, LocationSortOption, LocationsPage } from '@/types/location'
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
    sort: LocationSortOption,
    startCursor?: LocationID
): Promise<LocationsPage> => {
    const cursor = startCursor ? parseInt(startCursor) : undefined

    // Fetch locations of the specified region
    const { data } = await getPlaces({ query: { region, cursor, ...sortQueryMap[sort] } })
    const places = data?.places ?? []
    const nextCursor = data?.nextCursor?.toString()

    return {
        locations: places.map(placeToLocation),
        nextCursor
    }
}

/**
 * Get a single location by its ID.
 *
 * @param id - The ID of the location to fetch
 * @returns The location with the specified ID or undefined if not found
 */
export const getLocationById = async (id: LocationID): Promise<Location | undefined> => {
    // Fetch place with the specified ID
    const place = (await getPlacesById({ path: { id: parseInt(id) } })).data

    return place
        ? placeToLocation(place) // Convert to Location object
        : undefined
}
