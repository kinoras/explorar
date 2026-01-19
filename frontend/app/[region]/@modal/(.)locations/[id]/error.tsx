'use client'

import { useEffect } from 'react'

import { ModalCloseButton, ModalLayout } from '@/components/layout/modal'

import { showToast } from '@/services/toast'

import { LocationContentSkeleton, LocationHeader } from '@/app/[region]/(no-header)/locations/[id]'

const LocationModalError = ({ error }: { error: Error }) => {
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
        <ModalLayout>
            <LocationHeader>
                <ModalCloseButton />
            </LocationHeader>
            <LocationContentSkeleton />
        </ModalLayout>
    )
}

export default LocationModalError
