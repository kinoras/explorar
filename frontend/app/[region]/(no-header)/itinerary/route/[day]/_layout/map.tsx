'use client'

import { useEffect } from 'react'

import { useMap } from 'react-leaflet'

import { Map, MapMarker, MapTileLayer } from '@/components/ui/map'
import { Skeleton } from '@/components/ui/skeleton'

import { cn } from '@/lib/utils'

import type { Coordinates } from '@/types/location'

import { RouteMapMarker } from '../_components/map-marker'

const MapBoundsController = ({ positions }: { positions: Coordinates[] }) => {
    const map = useMap()

    // Fits the map bounds to the given positions
    useEffect(() => {
        if (positions.length)
            map.fitBounds(positions, {
                paddingTopLeft: [35, 95], // For header
                paddingBottomRight: [35, 50], // For gradient overlay
                maxZoom: 15
            })
    }, [positions, map])

    return null
}

const RouteMap = ({ positions }: { positions: { marker: number; coordinates: Coordinates }[] }) => {
    return (
        <div
            className={cn(
                'relative -mb-2 h-74! shrink-0',
                'after:absolute after:inset-x-0 after:bottom-0 after:z-10 after:h-8',
                'after:bg-linear-to-b after:from-transparent after:to-white'
            )}
        >
            <Map
                className="min-h-74! rounded-none!"
                // Initial state
                center={[0, 0]}
                zoomSnap={0.01}
                // Disable interactions
                doubleClickZoom={false}
                dragging={false}
                scrollWheelZoom={false}
                touchZoom={false}
            >
                <MapBoundsController positions={positions.map((pos) => pos.coordinates)} />
                <MapTileLayer />
                {positions.map(({ marker, coordinates }) => (
                    <MapMarker
                        key={marker}
                        icon={<RouteMapMarker size="sm" children={marker} />}
                        position={coordinates}
                    />
                ))}
            </Map>
        </div>
    )
}

const RouteMapSkeleton = () => {
    return <Skeleton className="h-72 shrink-0" />
}

export { RouteMap, RouteMapSkeleton }
