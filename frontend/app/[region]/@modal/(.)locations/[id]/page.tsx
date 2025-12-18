import { Suspense } from 'react'

import { notFound } from 'next/dist/client/components/navigation'

import { LocationLayout, LocationLayoutSkeleton } from '@/components/layout/location'
import { DialogContent } from '@/components/ui/dialog'

import { getLocationById } from '@/services/location/single'

import { cn } from '@/lib/utils'

import { LocationModalHeader } from './header'
import { LocationModalShell } from './shell'

const LocationModal = async ({ params }: PageProps<'/[region]/locations/[id]'>) => {
    const { id } = await params

    return (
        <LocationModalShell>
            <DialogContent
                showCloseButton={false}
                className={cn(
                    'max-h-[calc(100dvh-96px)] w-[calc(100vw-18px)] max-w-md',
                    'block! overflow-y-scroll border-none p-0!'
                )}
            >
                <LocationModalHeader title="Location Details" />

                <Suspense fallback={<LocationLayoutSkeleton />}>
                    <LocationContent id={Number(id)} />
                </Suspense>
            </DialogContent>
        </LocationModalShell>
    )
}

const LocationContent = async ({ id }: { id: number }) => {
    const location = await getLocationById(id)

    // Location not found
    if (!location) notFound()

    return <LocationLayout location={location} />
}

export default LocationModal
