import { LocationEntry, LocationEntrySkeleton } from '@/components/custom/location-entry'

import { getLocationsByRegion } from '@/services/location/list'
import type { LocationSortOption } from '@/services/location/sort'
import type { Region } from '@/services/region'

const Locations = async ({ region, sort }: { region: Region; sort: LocationSortOption }) => {
    const locations = await getLocationsByRegion(region, sort)

    return (
        <>
            {locations.map(({ id, images, name, description, rating, category }) => (
                <LocationEntry
                    key={id}
                    href={`/${region}/locations/${id}`}
                    // Data fields below
                    image={images[0]}
                    name={name}
                    description={description ?? ''}
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
