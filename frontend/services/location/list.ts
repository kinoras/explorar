import { type Place, getPlaces } from '@/integrations/client'

import { Region } from '@/services/region'

import { LocationSortOption } from './sort'

const adaptSortOption = (sort: LocationSortOption) => {
    switch (sort) {
        case 'rating':
            return { orderBy: 'rating', orderDir: 'desc' }
        case 'ranking':
            return { orderBy: 'ranking', orderDir: 'asc' }
    }
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
): Promise<Array<Place>> => {
    // Fetch locations of the specified region
    const locations = (await getPlaces({ query: { region, ...adaptSortOption(sort) } })).data

    // Return the fetched locations or an empty array if none are found
    return locations || []
}
