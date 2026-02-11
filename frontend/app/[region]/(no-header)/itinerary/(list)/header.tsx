import type { ComponentProps } from 'react'

import { faCalendar } from '@fortawesome/free-regular-svg-icons'
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { PageHeader } from '@/components/custom/page-header'
import { Button } from '@/components/ui/button'

import { useItineraryDuration, useItineraryList, useItineraryPlanning } from '@/services/itinerary'

import { useRegion } from '@/lib/context'
import { cn } from '@/lib/utils'

import { DurationDialog } from './_layout/duration-dialog'

const HeaderActionButton = ({ className, ...props }: ComponentProps<typeof Button>) => {
    return (
        <Button
            variant="outline"
            size="icon-xl"
            className={cn('rounded-full', className)}
            {...props}
        />
    )
}

const ItineraryHeader = ({
    children: closeButton,
    ...props
}: ComponentProps<typeof PageHeader>) => {
    const { region } = useRegion()
    const { itinerary } = useItineraryList(region)
    const { start, end, setDuration } = useItineraryDuration(region)
    const { plan, loading } = useItineraryPlanning(region)

    const isItineraryEmpty = itinerary.every((day) => day.locations.length === 0)

    return (
        <PageHeader floating masking={240} {...props}>
            {closeButton}

            <div className="flex flex-row gap-2">
                {/* Generate itinerary */}
                <HeaderActionButton onClick={plan} disabled={loading || isItineraryEmpty}>
                    <FontAwesomeIcon icon={faArrowsRotate} className="size-4!" spin={loading} />
                </HeaderActionButton>

                {/* Duration picker */}
                <DurationDialog duration={[start, end]} setDuration={setDuration}>
                    <HeaderActionButton>
                        <FontAwesomeIcon icon={faCalendar} size="lg" />
                    </HeaderActionButton>
                </DurationDialog>
            </div>
        </PageHeader>
    )
}

export { ItineraryHeader }
