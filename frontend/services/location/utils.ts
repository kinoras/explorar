import type { Place, RegularHour } from '@/integrations/client'

import { CategoryObject, getCategoryByKey } from '@/services/category'

import { defaultCategory } from '@/lib/config'

/**
 * Formats the rating number to one decimal place.
 * @param rating - The rating value to format
 * @returns Formatted rating as a string, or 'N/A' if invalid.
 */
export const formatRatingNumber = (rating: unknown): string => {
    switch (typeof rating) {
        case 'number':
            return Number(rating).toFixed(1)
        default:
            return 'N/A'
    }
}

/**
 * Formats the category text based on the category key.
 * @param key - The category key
 * @returns The category name or 'Uncategorised' if not found
 */
export const formatCategoryText = (key: string): string => {
    return getCategoryByKey(key)?.name
}

export type DailyHours = { open: string; close: string }
export type WeeklyHours = Record<number, DailyHours>
export type Location = {
    /** Unique identifier of the location. */
    id: Place['id']
    /** Name of the location. */
    name: string
    /** Description of the location. */
    description: string | undefined
    /** Category of the location. */
    category: CategoryObject
    /** URLs of images of the location. */
    images: string[]
    /** Rating of the location. */
    rating: number | undefined
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

/**
 * Parses the regular hours into a structured weekly hours format.
 * @param regularHours - The regular hours data from the Place object
 * @returns The parsed weekly hours, or undefined if no valid hours are found
 */
const parseWeeklyHours = (regularHours?: RegularHour[]): WeeklyHours | undefined => {
    const hours: WeeklyHours = {}

    regularHours?.forEach(({ day, open, close }) => {
        if (day && open && close) {
            hours[day % 7] = { open, close }
        }
    })

    return Object.keys(hours).length === 0
        ? undefined // No valid hours found
        : hours
}

/**
 * Converts a Place object into a Location object.
 * @param place - The Place object to parse
 * @returns The parsed Location object
 */
export const parseLocation = (place: Place): Location => ({
    id: place.id,
    name: place.name ?? 'Mysterious Place',
    category: getCategoryByKey(place.category ?? defaultCategory),
    description: place.description?.content,
    images: place.images ?? [],
    rating: place.rating ?? undefined,
    position: {
        address: place.location?.address ?? 'Somewhere on Earth',
        coordinates:
            place.location?.latitude && place.location?.longitude
                ? [place.location.latitude, place.location.longitude]
                : undefined
    },
    contacts: {
        phone: place.phone ?? undefined,
        website: place.website ?? undefined
    },
    hours: parseWeeklyHours(place.hours?.regular)
})
