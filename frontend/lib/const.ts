import type { CategoryDetails, CategoryKey } from '@/types/category'
import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'

export const supportedRegions: Region[] = ['hk', 'mo'] as const

export const locationSortOptions: LocationSortOption[] = ['ranking', 'rating'] as const

export const categories: Record<CategoryKey, CategoryDetails> = {
    entertainment: {
        name: 'Entertainment',
        image: '/assets/background/category-entertainment.webp' // https://unsplash.com/photos/TnwP3VdUCUA
    },
    landmarks: {
        name: 'Landmarks',
        image: '/assets/background/category-landmarks.webp' // https://unsplash.com/photos/8GIsOVL_rlY
    },
    museums: {
        name: 'Museums',
        image: '/assets/background/category-museums.webp' // https://unsplash.com/photos/PWzUSxpeI8o
    },
    shopping: {
        name: 'Shopping',
        image: '/assets/background/category-shopping.webp' // https://unsplash.com/photos/jo8C9bt3uo8
    },

    // Fallback
    uncategorised: {
        name: 'Uncategorised',
        image: '' // No image
    }
} as const
