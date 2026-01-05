'use client'

import { use } from 'react'

import { ModalCloseButton, ModalLayout } from '@/components/layout/modal'

import { RouteContent, RouteHeader } from '@/app/[region]/(no-header)/itinerary/route/[day]'
import { RouteMethodProvider } from '@/app/[region]/(no-header)/itinerary/route/[day]/_hooks/context'

const RouteModal = ({ params }: PageProps<'/[region]/itinerary/route/[day]'>) => {
    const { day } = use(params)

    return (
        <ModalLayout>
            <RouteMethodProvider>
                <RouteHeader>
                    <ModalCloseButton />
                </RouteHeader>
                <RouteContent day={Number(day)} />
            </RouteMethodProvider>
        </ModalLayout>
    )
}

export default RouteModal
