import { getCategories } from '@/integrations/client'
import { getErrorCode, getErrorMessage } from '@/integrations/errors'

import { defaultCategoryKey } from '@/lib/config'
import { categories } from '@/lib/const'
import { AppError } from '@/lib/errors'

import type { Category, CategoryKey } from '@/types/category'
import type { Region } from '@/types/region'

import { regionMap } from './region'

/**
 * Checks if a given string is a valid CategoryKey (appears in `categories`).
 *
 * @param key - The category key string to look up
 * @returns True if the key is a valid category key, false otherwise
 */
const validateCategoryKey = (keyString: string): keyString is CategoryKey => {
    return keyString in categories
}

/**
 * Converts a category key to its corresponding category object.
 *
 * @param key - The category key to look up
 * @returns The corresponding category object
 */
const categoryKeyToObject = (key: CategoryKey): Category => {
    const details = categories[key]
    return { key, ...details }
}

/**
 * Converts a string as a CategoryKey to a Category object.
 *
 * @param keyString - The category key string to look up
 * @returns The corresponding category object, or the default category if not found
 */
export const stringToCategory = (keyString: string): Category => {
    const key = validateCategoryKey(keyString) ? keyString : defaultCategoryKey
    return categoryKeyToObject(key)
}

/**
 * Fetches categories available in a region.
 *
 * @param region - The region to fetch categories for
 * @returns Array of categories in the given region
 */
export const getCategoriesByRegion = async (region: Region): Promise<Category[]> => {
    // Fetch categories (keys) of the specified region
    const { data, error } = await getCategories({ query: { region: regionMap[region] } })

    if (error) {
        const errorCode = getErrorCode(error)
        const errorMessage = getErrorMessage(error) ?? String(error)

        // Domain-specific error handling
        if (errorCode === 'categories.region.invalid')
            throw new AppError('INVALID_REGION', errorMessage)

        // General error
        throw new AppError('UNKNOWN', errorMessage)
    }

    // Return the categories as Category objects
    return (data?.categories ?? [])
        .filter(({ category }) => validateCategoryKey(category)) // Ensure valid category keys
        .map(({ category, count }) => ({ ...stringToCategory(category), count })) // Convert to Category objects
}
