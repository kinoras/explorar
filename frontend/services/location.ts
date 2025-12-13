import { type Place, getPlaces } from '@/integrations/client'

import { Region } from './region'

/**
 * Gets locations for a specific region.
 * 
 * @param region - The region to fetch locations for
 * @returns Array of places ordered by ranking
 */
export const getLocationsByRegion = async (region: Region): Promise<Array<Place>> => {
    // Fetch locations of the specified region
    const locations = (await getPlaces({ query: { region, orderBy: 'ranking' } })).data

    // Return the fetched locations or an empty array if none are found
    return locations || []
}
