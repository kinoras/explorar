import type { Category } from '@/types/category'

export type LocationSortOption =
    | 'ranking' // Ranking ASC
    | 'rating' // Rating DESC

type Rating = {
    /** The numeric value of the rating. */
    value: number
    /** The rating formatted as a string. */
    formatted: string
}

type DailyHours = {
    /** Opening time in `HH:MM` format. */
    open: string
    /** Closing time in `HH:MM` format. */
    close: string
    /** Formatted operating hours string. */
    formatted: string
}

/** Weekly operating hours, keyed by day of the week (0 = Sunday, 6 = Saturday). */
export type WeeklyHours = Record<number, DailyHours | undefined>

/** Unique identifier type for a location. */
export type LocationID = string

/** Location details object. */
export type Location = {
    /** Unique identifier of the location. */
    id: LocationID
    /** Name of the location. */
    name: string
    /** Description of the location. */
    description: string | undefined
    /** Category of the location. */
    category: Category
    /** URLs of images of the location. */
    images: string[]
    /** Rating of the location. */
    rating: Rating | undefined
    /** Position details of the location. */
    position: {
        /** Address of the location. */
        address: string
        /** Coordinates of the location as `[latitude, longitude]`. */
        coordinates: [number, number] | undefined
    }
    /** Contact details of the location. */
    contacts: {
        /** Phone number of the location. */
        phone?: string
        /** Website URL of the location. */
        website?: string
    }
    /** Operating hours of the location. */
    hours: WeeklyHours | undefined
}
