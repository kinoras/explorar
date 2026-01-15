'use client'

import { useEffect } from 'react'

import { useInView } from 'react-intersection-observer'

import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { useLocationsByRegion } from '@/services/location-hooks'

import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

const Locations = ({ region, sort }: { region: Region; sort: LocationSortOption }) => {
    const { locations, loading, loadMore, hasMore } = useLocationsByRegion(region, sort)
    const { ref, inView } = useInView()

    useEffect(() => {
        // Load more when:
        // 1. the sentinel comes into view
        // 2. there are more to load
        // 3. not currently loading
        if (inView && hasMore && !loading) loadMore()
    }, [inView, hasMore, loading, loadMore])

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
                    <LocationsSkeleton itemsCount={4} />
                </div>
            )}
        </>
    )
}

const LocationsSkeleton = ({ itemsCount }: { itemsCount: number }) => {
    return (
        <>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <LocationEntrySkeleton key={index} />
            ))}
        </>
    )
}

export { Locations, LocationsSkeleton }
