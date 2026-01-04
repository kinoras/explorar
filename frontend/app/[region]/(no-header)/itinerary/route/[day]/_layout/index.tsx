import { isPresent } from '@/lib/utils'

import type { Coordinates, Location, LocationID } from '@/types/location'

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
        </main>
    )
}

const RouteLayoutSkeleton = () => {
    return (
        <>
            <RouteMapSkeleton />
        </>
    )
}
export { RouteLayout, RouteLayoutSkeleton }
