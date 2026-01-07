import type { Metadata } from 'next'

import { SheetCloseButton, SheetLayout } from '@/components/layout/sheet'

import { ItineraryContent, ItineraryHeader } from '@/app/[region]/(no-header)/itinerary/(list)'

const ItinerarySheet = () => {
    return (
        <SheetLayout side="bottom">
            <ItineraryHeader>
                <SheetCloseButton />
            </ItineraryHeader>
            <ItineraryContent />
        </SheetLayout>
    )
}

// Seems not working with intercepting routes
export const generateMetadata = (): Metadata => ({
    title: 'My Itinerary'
})

export default ItinerarySheet
