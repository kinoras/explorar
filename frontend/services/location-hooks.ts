import useSWR from 'swr'
import useSWRInfinite from 'swr/infinite'

import { isPresent } from '@/lib/utils'

import type { Location, LocationID, LocationSortOption, LocationsPage } from '@/types/location'
import type { Region } from '@/types/region'

import { getLocationById, getLocationsByRegion } from './location'

type SWRInfiniteKey = readonly [
    Region,
    LocationSortOption,
    string | undefined, // Categories: CategoryKey[] joined by comma
    LocationID | undefined // Cursor for pagination
]

/**
 * Hook to fetch locations for a specific region.
 *
 * @param region - The region to fetch locations for
 * @param sort - The field to order by
 * @param categories - Optional array of categories to filter by
 * @returns An object containing the locations, loading state, and any error encountered.
 */
export const useLocationsByRegion = (
    region: Region,
    sort: LocationSortOption,
    categories?: string[]
): {
    /** Array of fetched locations. */
    locations: Location[]
    /** Indicates whether the data is currently being loaded. */
    loading: boolean
    /** Function to load more locations. */
    loadMore: () => void
    /** Indicates whether there are more locations to load. */
    hasMore: boolean
    /** Any error encountered during fetching. */
    error: unknown
} => {
    // NOTE: `undefined` means no filtering, while `[]` means "filter to no categories".
    // These are handled differently here intentionally.
    const _categories = categories?.sort().join(',')

    const { data, size, setSize, isValidating, error } = useSWRInfinite<LocationsPage>(
        // Key generator function
        (_, prevPage): SWRInfiniteKey | null =>
            prevPage && !prevPage.nextCursor
                ? null // No nextCursor for non-initial pages: reached the end
                : ([region, sort, _categories, prevPage?.nextCursor] as const), // Otherwise, return the key for fetching

        // Fetcher function
        ([region, sort, _categories, cursor]: SWRInfiniteKey) => {
            const categories = _categories?.split(',').filter(Boolean) // Boolean filter to handle empty for no categories
            return getLocationsByRegion(region, sort, categories, cursor)
        }
    )

    const loading =
        (!data && isValidating) || // Loading initial data
        (size > 0 && data && typeof data[size - 1] === 'undefined') // Loading subsequent pages

    const hasMore = !!data?.[data.length - 1]?.nextCursor // Check if there's a nextCursor in the last page

    return {
        locations: data?.flatMap((page) => page.locations) ?? [],
        loading: !!loading, // Convert to boolean
        loadMore: () => setSize(size + 1),
        hasMore,
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
