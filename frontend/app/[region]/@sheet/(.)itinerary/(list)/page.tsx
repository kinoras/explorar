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

export default ItinerarySheet
