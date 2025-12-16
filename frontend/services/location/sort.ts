import { defaultLocationSortOption } from '@/lib/config'

// Defining sort options
const sortOptions = [
    'ranking', // Ranking: Smaller number first
    'rating' // Rating: Higher first
] as const
export type LocationSortOption = (typeof sortOptions)[number]

/**
 * Validates if a string is a valid location sort option.
 *
 * @param sort - The sort option string to validate
 * @returns True if the sort option is valid, false otherwise
 */
const validateLocationSortOption = (sort: string): sort is LocationSortOption => {
    return sortOptions.includes(sort as LocationSortOption)
}

/**
 * Parses and validates a sort option string.
 *
 * @param sort - The sort option string to parse
 * @returns The validated sort option or the default option if invalid
 */
export const parseSortOption = (sort?: string): LocationSortOption => {
    return sort && validateLocationSortOption(sort)
        ? sort // Valid option
        : defaultLocationSortOption // Fallback
}
