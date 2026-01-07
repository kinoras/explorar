import { Suspense } from 'react'

import { ModalCloseButton, ModalLayout } from '@/components/layout/modal'

import {
    LocationContent,
    LocationContentSkeleton,
    LocationHeader,
    getLocationMetadata
} from '@/app/[region]/(no-header)/locations/[id]'

const LocationModal = async ({ params }: PageProps<'/[region]/locations/[id]'>) => {
    const { id } = await params

    return (
        <ModalLayout>
            <LocationHeader>
                <ModalCloseButton />
            </LocationHeader>
            <Suspense fallback={<LocationContentSkeleton />}>
                <LocationContent id={id} />
            </Suspense>
        </ModalLayout>
    )
}

// Seems not working with intercepting routes
export const generateMetadata = async ({ params }: PageProps<'/[region]/locations/[id]'>) =>
    getLocationMetadata((await params).id)

export default LocationModal
