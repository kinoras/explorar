import { Map, MapMarker, MapTileLayer, MapZoomControl } from '@/components/ui/map'
import { Skeleton } from '@/components/ui/skeleton'

import { DataSection, DataSectionSkeleton } from '../_components/section'

const LocationMap = ({ coordinates }: { coordinates: [number, number] }) => {
    return (
        <DataSection title="Map of Location">
            <div className="py-0.5">
                <Map
                    center={coordinates}
                    zoom={15}
                    dragging={false}
                    scrollWheelZoom={false}
                    className="min-h-40! rounded-xl"
                >
                    <MapTileLayer />
                    <MapZoomControl className="top-2 left-2" />
                    <MapMarker position={coordinates} />
                    <span className="text-subtitle absolute right-2 bottom-1.5 z-5000">
                        Move the map with two fingers
                    </span>
                </Map>
            </div>
        </DataSection>
    )
}

const LocationMapSkeleton = () => {
    return (
        <DataSectionSkeleton>
            <div className="py-0.5">
                <Skeleton className="h-40 rounded-xl" />
            </div>
        </DataSectionSkeleton>
    )
}

export { LocationMap, LocationMapSkeleton }
