'use client'

import { useEffect } from 'react'

import { useInView } from 'react-intersection-observer'

import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { useLocationsByRegion } from '@/services/location-hooks'
import { showToast } from '@/services/toast'

import { getAppErrorDescription } from '@/lib/errors'

import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

const LocationsList = ({
    region,
    sort,
    categories
}: {
    region: Region
    sort: LocationSortOption
    categories?: string[]
}) => {
    const { locations, loading, loadMore, hasMore, error } = useLocationsByRegion(
        region,
        sort,
        categories
    )
    const { ref, inView } = useInView()

    useEffect(() => {
        // Load more when:
        // 1. the sentinel comes into view
        // 2. there are more to load
        // 3. not currently loading
        if (inView && hasMore && !loading) loadMore()
    }, [inView, hasMore, loading, loadMore])

    // Handle errors
    useEffect(() => {
        if (error) {
            showToast({
                type: 'error',
                message: {
                    title: 'Failed to load locations',
                    description: getAppErrorDescription(error)
                }
            })
        }
    }, [error])

    return (
        <>
            {locations.map(({ id, images, name, description, rating, category }) => (
                <LocationEntry
                    key={id}
                    identifier={`${id}`}
                    // Data fields below
                    image={images[0]}
                    name={name}
                    description={description ?? ''}
                    ratingNumber={rating?.value}
                    ratingString={rating?.formatted}
                    category={category.name}
                />
            ))}
            {(loading || hasMore) && (
                <div ref={ref} className="space-y-4.5">
                    <LocationsListSkeleton itemsCount={4} />
                </div>
            )}
        </>
    )
}

const LocationsListSkeleton = ({ itemsCount }: { itemsCount: number }) => {
    return (
        <>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <LocationEntrySkeleton key={index} />
            ))}
        </>
    )
}

export { LocationsList, LocationsListSkeleton }
