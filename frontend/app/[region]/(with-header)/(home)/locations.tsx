import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { getLocationsByRegion } from '@/services/location'

import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

const Locations = async ({ region, sort }: { region: Region; sort: LocationSortOption }) => {
    const locations = await getLocationsByRegion(region, sort)

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
