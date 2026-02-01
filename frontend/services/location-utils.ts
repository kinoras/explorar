import type { PlacePublic } from '@/integrations/client'

import { defaultLocationSortOption } from '@/lib/config'
import { locationSortOptions } from '@/lib/const'
import { isPresent } from '@/lib/utils'

import type { Location, LocationSortOption, WeeklyHours } from '@/types/location'

import { stringToCategory } from './category'

/**
 * Validates if a string is a valid location sort option.
 *
 * @param optionString - The sort option string to validate
 * @returns True if the sort option is valid, false otherwise
 */
const validateLocationSortOption = (optionString: string): optionString is LocationSortOption => {
    return locationSortOptions.includes(optionString as LocationSortOption)
}

/**
 * Converts a string to Location Sort Option, defaulting if invalid.
 *
 * @param optionString - The sort option string to convert
 * @returns The corresponding sort option if valid, otherwise the default sort option
 */
export const stringToLocationSortOption = (optionString: string): LocationSortOption => {
    return validateLocationSortOption(optionString) ? optionString : defaultLocationSortOption
}

/**
 * Converts a PlacePublic object into a Location object.
 *
 * @param place - The PlacePublic object to parse
 * @returns The resolved Location object
 */
export const placeToLocation = (place: PlacePublic): Location => {
    return {
        id: place.id,
        name: place.name,
        category: stringToCategory(place.category),
        description: place.description?.content,
        images: place.images ?? [],
        rating: isPresent(place.rating)
            ? { value: place.rating, formatted: Number(place.rating).toFixed(1) }
            : undefined,
        position: {
            address: place.location.address,
            coordinates: [place.location.latitude, place.location.longitude]
        },
        contacts: {
            phone: place.phone ?? undefined,
            website: place.website ?? undefined
        },
        hours: isPresent(place.hours?.regular)
            ? place.hours.regular.reduce<WeeklyHours>((hours, { day, open, close }) => {
                  if (isPresent(day) && open && close)
                      hours[day % 7] = { open, close, formatted: `${open} – ${close}` }
                  return hours
              }, {})
            : undefined
    }
}
