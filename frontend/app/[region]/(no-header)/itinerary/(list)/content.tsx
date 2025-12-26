'use client'

import dayjs from 'dayjs'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'
import { isPresent } from '@/lib/utils'

import { ItineraryLocations, ItineraryLocationsSkeleton } from './_layout/locations'

const ItineraryContent = () => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)
    const { locations, loading } = useLocations(itinerary)

    if (loading) {
        // Show fallback while loading
        return <ItineraryLocationsSkeleton />
    }

    return (
        <ItineraryLocations
            day={1}
            date={dayjs().toString()}
            locations={itinerary
                .map((locId) => locations.find((loc) => loc.id === locId))
                .filter(isPresent)}
        />
    )
}

export { ItineraryContent }
