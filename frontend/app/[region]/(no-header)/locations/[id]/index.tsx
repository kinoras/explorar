import type { ComponentProps } from 'react'

import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/custom/page-header'

import { getLocationById } from '@/services/location'

import type { LocationID } from '@/types/location'

import { LocationLayout, LocationLayoutSkeleton } from './_layout'

const LocationContent = async ({ id }: { id: LocationID }) => {
    const location = await getLocationById(id)

    // Location not found
    if (!location) notFound()

    return <LocationLayout location={location} />
}

const LocationContentSkeleton = LocationLayoutSkeleton

const LocationHeader = ({ children: closeButton, ...props }: ComponentProps<typeof PageHeader>) => {
    return (
        <PageHeader floating {...props}>
            {closeButton}
        </PageHeader>
    )
}

export { LocationContent, LocationContentSkeleton, LocationHeader }
