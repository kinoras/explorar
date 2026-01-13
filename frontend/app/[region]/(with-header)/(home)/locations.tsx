'use client'

import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { useLocationsByRegion } from '@/services/location-hooks'

import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

const Locations = ({ region, sort }: { region: Region; sort: LocationSortOption }) => {
    const { locations, loading } = useLocationsByRegion(region, sort)

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
            {loading && <LocationsSkeleton itemsCount={4} />}
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
