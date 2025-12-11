/** Supported regions */
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
