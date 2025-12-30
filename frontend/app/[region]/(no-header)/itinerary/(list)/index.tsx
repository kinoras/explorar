'use client'

import type { ComponentProps } from 'react'

import dayjs from 'dayjs'

import { PageHeader } from '@/components/custom/page-header'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'
import { isPresent } from '@/lib/utils'

import { ItineraryLocations, ItineraryLocationsSkeleton } from './_layout/locations'

const ItineraryContent = () => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)

    // Fetch details for all locations in the itinerary
    const { locations, loading } = useLocations(itinerary.locations.flat())

    if (loading) {
        // Show fallback while loading
        return <ItineraryLocationsSkeleton />
    }

    return itinerary.locations.map((dailyLocations, index) => (
        <ItineraryLocations
            key={index}
            day={index + 1}
            date={dayjs(itinerary.start).add(index, 'day').format('YYYY-MM-DD')}
            locations={dailyLocations
                .map((locId) => locations.find((loc) => loc.id === locId))
                .filter(isPresent)}
        />
    ))
}

const ItineraryHeader = ({
    children: closeButton,
    ...props
}: ComponentProps<typeof PageHeader>) => {
    return <PageHeader {...props}>{closeButton}</PageHeader>
}

export { ItineraryContent, ItineraryHeader }
