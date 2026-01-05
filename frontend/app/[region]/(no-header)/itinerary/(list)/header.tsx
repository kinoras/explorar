import type { ComponentProps } from 'react'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PageHeader } from '@/components/custom/page-header'
import { Button } from '@/components/ui/button'

import { useItineraryDuration } from '@/services/itinerary'

import { useRegion } from '@/lib/context'

import { DurationDialog } from './_layout/duration-dialog'

const ItineraryHeader = ({
    children: closeButton,
    ...props
}: ComponentProps<typeof PageHeader>) => {
    const { region } = useRegion()
    const { start, end, setDuration } = useItineraryDuration(region)

    return (
        <PageHeader floating masking={240} {...props}>
            {closeButton}

            {/* Duration picker */}
            <DurationDialog duration={[start, end]} setDuration={setDuration}>
                <Button variant="outline" size="icon-xl" className="rounded-full">
                    <FontAwesomeIcon icon={faCalendar} size="lg" />
                </Button>
            </DurationDialog>
        </PageHeader>
    )
}

export { ItineraryHeader }
