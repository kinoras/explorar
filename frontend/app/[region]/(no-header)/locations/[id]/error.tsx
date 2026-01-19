'use client'

import { useEffect } from 'react'

import { NaviButton } from '@/components/atoms/navi-button'

import { showToast } from '@/services/toast'

import { LocationContentSkeleton, LocationHeader } from '.'

const LocationErrorPage = ({ error }: { error: Error }) => {
    useEffect(() => {
        showToast({
            type: 'error',
            message: {
                title: 'Failed to load location',
                description: 'Please try again later.'
            }
        })
    }, [error])

    return (
        <>
            <LocationHeader>
                <NaviButton appearance="back" href="/" />
            </LocationHeader>
            <LocationContentSkeleton />
        </>
    )
}

export default LocationErrorPage
