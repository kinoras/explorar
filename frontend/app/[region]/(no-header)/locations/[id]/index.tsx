import type { ComponentProps } from 'react'

import type { Metadata } from 'next'
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
        <PageHeader floating masking={200} {...props}>
            {closeButton}
        </PageHeader>
    )
}

const getLocationMetadata = async (id: LocationID): Promise<Metadata> => {
    const location = await getLocationById(id)
    return location
        ? { title: location.name, description: location.description }
        : { title: 'Location Not Found' }
}

export { LocationContent, LocationContentSkeleton, LocationHeader, getLocationMetadata }
