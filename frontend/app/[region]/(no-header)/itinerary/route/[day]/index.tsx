'use client'

import { notFound } from 'next/navigation'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'

import { useRegion } from '@/lib/context'

import { RouteLayout, RouteLayoutSkeleton } from './_layout'
import { RouteHeader } from './header'

const RouteContent = ({ day }: { day: number }) => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)
    const dailyItinerary = itinerary[day - 1]

    // Validate day index
    if (!dailyItinerary || !dailyItinerary.locations.length) {
        notFound()
    }

    // Fetch details for the locations in the itinerary
    const { date, locations: locationIds } = dailyItinerary
    const { locations, loading: locationsLoading } = useLocations(locationIds)

    // Show fallback while loading
    if (locationsLoading) {
        return <RouteLayoutSkeleton />
    }

    return <RouteLayout locationIds={locationIds} locations={locations} />
}

export { RouteContent, RouteHeader }
