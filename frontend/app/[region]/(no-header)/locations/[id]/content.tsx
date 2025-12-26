import { notFound } from 'next/navigation'

import { getLocationById } from '@/services/location'

import { LocationLayout, LocationLayoutSkeleton } from './_layout'

const LocationContent = async ({ id }: { id: number }) => {
    const location = await getLocationById(id)

    // Location not found
    if (!location) notFound()

    return <LocationLayout location={location} />
}

const LocationContentSkeleton = LocationLayoutSkeleton

export { LocationContent, LocationContentSkeleton }
