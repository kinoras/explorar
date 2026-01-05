'use client'

import { notFound } from 'next/navigation'

import { useItineraryList } from '@/services/itinerary'
import { useLocations } from '@/services/location-hooks'
import { useRoutes } from '@/services/route-hooks'

import { useRegion } from '@/lib/context'

import { useRouteMethod } from './_hooks/context'
import { RouteLayout, RouteLayoutSkeleton } from './_layout'
import { RouteHeader } from './header'

const RouteContent = ({ day }: { day: number }) => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)
    const { method } = useRouteMethod()
    const dailyItinerary = itinerary[day - 1]

    // Validate day index
    if (!dailyItinerary || !dailyItinerary.locations.length) {
        notFound()
    }

    // Fetch details for the locations in the itinerary
    const { date, locations: locationIds } = dailyItinerary
    const { locations, loading: locationsLoading } = useLocations(locationIds)
    const { routes, loading: routesLoading } = useRoutes(date, method, locationIds)

    // Show fallback while loading
    if (locationsLoading || routesLoading) {
        return <RouteLayoutSkeleton />
    }

    return <RouteLayout locationIds={locationIds} locations={locations} routes={routes} />
}

export { RouteContent, RouteHeader }
