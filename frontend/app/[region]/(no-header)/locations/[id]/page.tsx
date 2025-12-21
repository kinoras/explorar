import { Suspense } from 'react'

import { notFound } from 'next/navigation'

import { LocationLayout, LocationLayoutSkeleton } from '@/components/layout/location'

import { getLocationById } from '@/services/location'

import { LocationPageHeader } from './header'

const LocationPage = async ({ params }: PageProps<'/[region]/locations/[id]'>) => {
    const { id } = await params

    return (
        <>
            <LocationPageHeader />
            <Suspense fallback={<LocationLayoutSkeleton />}>
                <LocationContent id={Number(id)} />
            </Suspense>
        </>
    )
}

const LocationContent = async ({ id }: { id: number }) => {
    const location = await getLocationById(id)

    // Location not found
    if (!location) notFound()

    return <LocationLayout location={location} />
}

export default LocationPage
