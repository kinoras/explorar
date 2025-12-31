import { Suspense } from 'react'

import { NaviButton } from '@/components/atoms/navi-button'

import { LocationContent, LocationContentSkeleton, LocationHeader } from '.'

const LocationPage = async ({ params }: PageProps<'/[region]/locations/[id]'>) => {
    const { id } = await params

    return (
        <>
            <LocationHeader>
                <NaviButton appearance="back" href="/" />
            </LocationHeader>
            <Suspense fallback={<LocationContentSkeleton />}>
                <LocationContent id={id} />
            </Suspense>
        </>
    )
}

export default LocationPage
