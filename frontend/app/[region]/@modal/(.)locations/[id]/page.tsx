import { Suspense } from 'react'

import { DialogContent } from '@/components/ui/dialog'

import { cn } from '@/lib/utils'

import {
    LocationContent,
    LocationContentSkeleton
} from '@/app/[region]/(no-header)/locations/[id]/content'

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

                <Suspense fallback={<LocationContentSkeleton />}>
                    <LocationContent id={Number(id)} />
                </Suspense>
            </DialogContent>
        </LocationModalShell>
    )
}

export default LocationModal
