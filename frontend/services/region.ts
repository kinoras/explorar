import { defaultRegion } from '@/lib/config'
import { supportedRegions } from '@/lib/const'

import type { Region } from '@/types/region'

/**
 * Validates if a string is a supported region.
 *
 * @param regionString - The region string to validate
 * @returns True if the region string is valid, false otherwise
 */
export const validateRegion = (regionString: string): regionString is Region => {
    return supportedRegions.includes(regionString as Region)
}

/**
 * Converts a string to Region type, defaulting if invalid.
 *
 * @param regionString - The region string to convert
 * @returns The corresponding region if valid, otherwise the default region
 */
export const stringToRegion = (regionString: string): Region => {
    return validateRegion(regionString) ? regionString : defaultRegion
}
