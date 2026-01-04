import { isPresent } from '@/lib/utils'

import type { Coordinates, Location, LocationID } from '@/types/location'

import { RouteLocation, RouteLocationSkeleton } from '../_components/location'
import { RouteMap, RouteMapSkeleton } from './map'

const RouteLayout = ({
    locationIds,
    locations
}: {
    locationIds: LocationID[]
    locations: Location[]
}) => {
    // Process location and route data
    const data = locationIds
        .map((locId) => locations.find((loc) => loc.id === locId)) // Map location details
        .filter(isPresent) // Filter invalid locations
        .map((location, index) => ({
            marker: index + 1,
            location,
            coordinates: {
                current: location.position.coordinates // Current location
            }
        }))

    return (
        <main>
            <RouteMap
                positions={data
                    .filter((item) => isPresent(item.coordinates.current))
                    .map((item) => ({
                        marker: item.marker,
                        coordinates: item.coordinates.current as Coordinates // Filtered above
                    }))}
            />
            <ul className="relative z-0 flex flex-col gap-4.5 px-4.5 py-5">
                {data.map(({ marker, location }) => (
                    <RouteLocation
                        key={location.id}
                        index={marker}
                        image={location.images[0]}
                        name={location.name}
                        address={location.position.address}
                    />
                ))}
                <span className="absolute inset-y-8 left-7.25 -z-1 w-0.5 bg-neutral-200" />
            </ul>
        </main>
    )
}

const RouteLayoutSkeleton = () => {
    return (
        <main>
            <RouteMapSkeleton />
            <div className="relative z-0 flex flex-col gap-4.5 px-4.5 py-5">
                {Array.from({ length: 6 }).map((_, index) => (
                    <RouteLocationSkeleton key={index} />
                ))}
            </div>
        </main>
    )
}
export { RouteLayout, RouteLayoutSkeleton }
