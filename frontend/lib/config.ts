import type { LocationSortOption } from '@/services/location/sort'
import type { Region } from '@/services/region'

type RegionalConfig = {
    /** Page title */
    title: string
    /** Logo image path */
    logo: string
    /** Decoration pattern image path */
    pattern: string
}

const appConfigs: Record<Region, RegionalConfig> = {
    hk: {
        title: 'Explore Hong Kong',
        logo: '/assets/brand/hong-kong.svg',
        pattern: '/assets/brand/azulejo.svg'
    },
    mo: {
        title: 'Explore Macau',
        logo: '/assets/brand/macau.svg',
        pattern: '/assets/brand/azulejo.svg'
    }
} as const

/** Default values */
export const defaultRegion: Region = 'mo'
export const defaultLocationSortOption: LocationSortOption = 'ranking'

/**
 * Gets the app configuration for a region.
 * @param region - The region to get configuration for
 * @returns The regional app configuration object
 */
export const getAppConfigByRegion = (region: Region): RegionalConfig => {
    return appConfigs[region] ?? appConfigs[defaultRegion]
}
