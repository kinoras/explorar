import { getCategories } from '@/integrations/client'

import type { Region } from './region'

type Category = string
type CategoryDetail = { name: string; image: string }

export const categoryDetails: Record<Category, CategoryDetail> = {
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
    }
}

type GetCategoriesByRegionResult = {
    key: Category
    name: string
    image: string
}[]

/**
 * Fetches categories available in a region.
 *
 * @param region - The region to fetch categories for
 * @returns Array of category objects with key, name, and image
 */
export const getCategoriesByRegion = async (
    region: Region
): Promise<GetCategoriesByRegionResult> => {
    // Fetch categories of the specified region
    const categories = (await getCategories({ query: { region } })).data

    // Return only the category details that are present in the fetched categories
    return Object.entries(categoryDetails)
        .map(([key, value]) => ({ key, ...value }))
        .filter((category) => categories?.includes(category.key))
}

/**
 * Gets category details by category key.
 *
 * @param key - The category key to look up
 * @returns Category details or null if not found
 */
export const getCategoryByKey = (key: Category): CategoryDetail | null => {
    return categoryDetails[key] || null
}
