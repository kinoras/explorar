import { Suspense } from 'react'

import { ModalCloseButton, ModalLayout } from '@/components/layout/modal'

import {
    LocationContent,
    LocationContentSkeleton,
    LocationHeader
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

export default LocationModal
