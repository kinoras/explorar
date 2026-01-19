'use client'

import { useEffect } from 'react'

import { showToast } from '@/services/toast'

import { CategoryTabsSkeleton } from './category-tabs'

const CategoryTabsError = ({ message }: { message: string }) => {
    useEffect(() => {
        showToast({
            type: 'error',
            message: {
                title: 'Failed to load categories',
                description: message
            }
        })
    }, [message, showToast])

    return <CategoryTabsSkeleton />
}

export default CategoryTabsError
