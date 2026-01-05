'use client'

import { use } from 'react'

import { NaviButton } from '@/components/atoms/navi-button'

import { RouteContent, RouteHeader } from '.'
import { RouteMethodProvider } from './_hooks/context'

const RoutePage = ({ params }: PageProps<'/[region]/itinerary/route/[day]'>) => {
    const { region, day } = use(params)

    // Workaround to avoid intercepting routes
    const handleBack = () => (window.location.href = `/${region}/itinerary`)

    return (
        <RouteMethodProvider>
            <RouteHeader>
                <NaviButton appearance="back" onClick={handleBack} />
            </RouteHeader>
            <RouteContent day={Number(day)} />
        </RouteMethodProvider>
    )
}

export default RoutePage
