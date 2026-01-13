import useSWR from 'swr'

import { isPresent } from '@/lib/utils'

import type { Location, LocationID, LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

import { getLocationById, getLocationsByRegion } from './location'

/**
 * Hook to fetch locations for a specific region.
 *
 * @param region - The region to fetch locations for
 * @param sort - The field to order by
 * @returns An object containing the locations, loading state, and any error encountered.
 */
export const useLocationsByRegion = (
    region: Region,
    sort: LocationSortOption
): {
    /** Array of fetched locations. */
    locations: Location[]
    /** Indicates whether the data is currently being loaded. */
    loading: boolean
    /** Any error encountered during fetching. */
    error: unknown
} => {
    const { data, error, isLoading } = useSWR(
        [region, sort], // SWR key
        () => getLocationsByRegion(region, sort)
    )

    return {
        locations: data ?? [],
        loading: isLoading,
        error
    }
}

/**
 * Hook to fetch multiple locations by their IDs.
 *
 * @param ids - Array of location IDs to fetch
 * @returns An object containing the locations, loading state, and any error encountered.
 */
export const useLocations = (
    ids: LocationID[]
): {
    /** Array of fetched locations, sorted by their IDs. */
    locations: Location[]
    /** Indicates whether the data is currently being loaded. */
    loading: boolean
    /** Any error encountered during fetching. */
    error: unknown
} => {
    const sortedIds = ids.toSorted()

    const { data, error, isLoading } = useSWR(
        ['itinerary-locations', sortedIds.join(',')], // SWR key
        () => Promise.all(sortedIds.map(getLocationById)) // Fetcher
    )

    return {
        locations: (data ?? []).filter(isPresent),
        loading: isLoading,
        error
    }
}
