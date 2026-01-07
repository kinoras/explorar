import type { Metadata } from 'next'

import { NaviButton } from '@/components/atoms/navi-button'

import { ItineraryContent, ItineraryHeader } from '.'

const ItineraryPage = () => {
    return (
        <>
            <ItineraryHeader>
                <NaviButton appearance="back" href="/" />
            </ItineraryHeader>
            <ItineraryContent />
        </>
    )
}

export const generateMetadata = (): Metadata => ({
    title: 'My Itinerary'
})

export default ItineraryPage
