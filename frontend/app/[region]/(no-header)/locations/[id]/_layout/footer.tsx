'use client'

import { faCheck, faPlus } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import { Footer } from '@/components/ui/footer'
import { Skeleton } from '@/components/ui/skeleton'

import { useItineraryItem } from '@/services/itinerary'

import { useRegion } from '@/lib/context'

import type { LocationID } from '@/types/location'

const blockStyles = {
    root: 'flex gap-2 p-4',
    button: 'flex h-12 flex-1 items-center gap-2 rounded-xl'
}

const LocationFooter = ({ id }: { id: LocationID }) => {
    const { region } = useRegion()

    const [inList, append, remove] = useItineraryItem(region, id)

    return (
        <Footer className={blockStyles.root} outline="shadow">
            <Button
                className={blockStyles.button}
                variant={inList ? 'secondary' : 'theme'}
                onClick={inList ? remove : append}
                suppressHydrationWarning
            >
                <FontAwesomeIcon icon={inList ? faCheck : faPlus} />
                <span>{inList ? 'Added to My Itinerary' : 'Add to My Itinerary'}</span>
            </Button>
        </Footer>
    )
}

const LocationFooterSkeleton = () => (
    <Footer className={blockStyles.root} outline="shadow">
        <Skeleton className={blockStyles.button} />
    </Footer>
)

export { LocationFooter, LocationFooterSkeleton }
