'use client'

import { useEffect } from 'react'

import { showToast } from '@/services/toast'

import { CategoriesSkeleton } from './categories'

const CategoriesError = ({ message }: { message: string }) => {
    useEffect(() => {
        showToast({
            type: 'error',
            message: {
                title: 'Failed to load categories',
                description: message
            }
        })
    }, [message])

    return <CategoriesSkeleton itemsCount={2} />
}

export default CategoriesError
