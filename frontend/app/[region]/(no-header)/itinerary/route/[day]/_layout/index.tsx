import { Fragment } from 'react'

import { cn, isPresent } from '@/lib/utils'

import type { Coordinates, Location, LocationID } from '@/types/location'
import type { Route } from '@/types/route'

import { RouteLocation, RouteLocationSkeleton } from '../_components/location'
import { RouteSegment, RouteSegmentSkeleton } from '../_components/segment'
import { RouteMap, RouteMapSkeleton } from './map'

const RouteLayout = ({
    locationIds,
    locations,
    routes
}: {
    locationIds: LocationID[]
    locations: Location[]
    routes: Route[]
}) => {
    // Process location and route data
    const data = locationIds
        .map((locId) => locations.find((loc) => loc.id === locId)) // Map location details
        .filter(isPresent) // Filter invalid locations
        .map((location, index, locations) => ({
            marker: index + 1,
            location,
            /** Route from current location to the next */
            route: routes.find(
                (route) =>
                    route.locations.origin === location.id &&
                    route.locations.destination === locations[index + 1]?.id // Possibly undefined (last item)
            ),
            /** Coordinates of the route endpoints. */
            coordinates: {
                current: location.position.coordinates, // Current location
                next: locations[index + 1]?.position?.coordinates // Next location
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
                segments={data.map((item) => item.route?.polyline).filter(isPresent)}
            />
            <ul
                className={cn(
                    'relative z-0 flex flex-col gap-4 px-4.5 py-6',
                    'before:absolute before:inset-y-8 before:left-7.25 before:-z-1 before:w-0.5 before:bg-neutral-200'
                )}
            >
                {data.map(({ marker, location, route, coordinates }) => (
                    <Fragment key={location.id}>
                        <RouteLocation
                            index={marker}
                            image={location.images[0]}
                            name={location.name}
                            address={location.position.address}
                        />
                        {route && (
                            <RouteSegment
                                duration={route.duration}
                                distance={route.distance}
                                method={route.method}
                                origin={coordinates.current}
                                destination={coordinates.next}
                            />
                        )}
                    </Fragment>
                ))}
            </ul>
        </main>
    )
}

const RouteLayoutSkeleton = () => {
    return (
        <main>
            <RouteMapSkeleton />
            <div className="relative z-0 flex flex-col gap-4.5 px-4.5 py-6">
                {Array.from({ length: 4 }).map((_, index) => (
                    <Fragment key={index}>
                        <RouteLocationSkeleton />
                        {index < 3 && <RouteSegmentSkeleton />}
                    </Fragment>
                ))}
            </div>
        </main>
    )
}
export { RouteLayout, RouteLayoutSkeleton }
