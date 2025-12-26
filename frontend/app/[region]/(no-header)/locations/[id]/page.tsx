import { Suspense } from 'react'

import { LocationContent, LocationContentSkeleton } from './content'
import { LocationPageHeader } from './header'

const LocationPage = async ({ params }: PageProps<'/[region]/locations/[id]'>) => {
    const { id } = await params

    return (
        <>
            <LocationPageHeader />
            <Suspense fallback={<LocationContentSkeleton />}>
                <LocationContent id={Number(id)} />
            </Suspense>
        </>
    )
}

export default LocationPage
