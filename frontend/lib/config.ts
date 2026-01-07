import type { CategoryKey } from '@/types/category'
import type { LocationSortOption } from '@/types/location'
import type { Region } from '@/types/region'
import type { TransitMethod } from '@/types/route'

type RegionalConfig = {
    /** Region name */
    name: string
    /** Page title */
    title: string
    /** Page description */
    description: string
    /** Logo image path */
    logo: string
    /** Decoration pattern image path */
    pattern: string
    /** Cover image path */
    cover: string
}

const appConfigs: Record<Region, RegionalConfig> = {
    hk: {
        name: 'Hong Kong',
        title: 'Explore Hong Kong',
        description: 'Discover the best of Hong Kong.',
        logo: '/assets/brand/hong-kong.svg',
        pattern: '/assets/brand/azulejo.svg',
        cover: '/assets/background/cover-hong-kong.webp' // https://unsplash.com/photos/ckxoFlEtlUc
    },
    mo: {
        name: 'Macau',
        title: 'Explore Macau',
        description: 'Discover the best of Macau.',
        logo: '/assets/brand/macau.svg',
        pattern: '/assets/brand/azulejo.svg',
        cover: '/assets/background/cover-macau.webp' // https://unsplash.com/photos/8Eu3HZXMYf8
    }
} as const

type ItineraryConfig = {
    /** Minimum and maximum duration (in days) for an itinerary */
    durationLimits: { min: number; max: number }
    /** Allowed period (in days relative to now) for selecting itinerary dates */
    periodLimits: { start: number; end: number }
}

export const itineraryConfigs: ItineraryConfig = {
    durationLimits: { min: 0, max: 30 }, // 1 to 30 days
    periodLimits: { start: -7, end: 90 } // From 7 days ago to 90 days later
} as const

// Default values
export const defaultRegion: Region = 'mo'
export const defaultCategoryKey: CategoryKey = 'uncategorised'
export const defaultLocationSortOption: LocationSortOption = 'ranking'
export const defaultTransitMethod: TransitMethod = 'transit'

/**
 * Gets the app configuration for a region.
 *
 * @param region - The region to get configuration for
 * @returns The regional app configuration object
 */
export const getAppConfigByRegion = (region: Region): RegionalConfig => {
    return appConfigs[region] ?? appConfigs[defaultRegion]
}
