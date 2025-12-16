import { defaultRegion } from '@/lib/config'

// Defining supported regions
const regions = [
    'hk', // Hong Kong
    'mo' // Macau
] as const
export type Region = (typeof regions)[number]

/**
 * Validates if a string is a supported region.
 *
 * @param region - The region string to validate
 * @returns True if the region is valid, false otherwise
 */
export const validateRegion = (region: string): region is Region => {
    return regions.includes(region as Region)
}

/**
 * Parses and validates a region string.
 *
 * @param region - The region string to parse
 * @returns The validated region or the default region if invalid
 */
export const parseRegion = (region?: string): Region => {
    return region && validateRegion(region)
        ? region // Valid region
        : defaultRegion // Fallback
}
