import { use } from 'react'

import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { getLocationsByRegion } from '@/services/location'
import type { Region } from '@/services/region'

const Locations = ({ region }: { region: Region }) => {
    const locations = use(getLocationsByRegion(region))

    return (
        <>
            {locations.map(({ id, images, name, description, rating, category }) => (
                <LocationEntry
                    key={id}
                    href={`/${region}/locations/${id}`}
                    // Data fields below
                    image={images?.[0]}
                    name={name ?? ''}
                    description={description?.content ?? ''}
                    rating={rating ?? undefined}
                    category={category}
                />
            ))}
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
