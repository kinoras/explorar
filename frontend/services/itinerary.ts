import dayjs from 'dayjs'
import useSWRMutation from 'swr/mutation'

import { showToast } from '@/services/toast'

import { getAppErrorDescription, toAppError } from '@/lib/errors'

import { useItineraryStore } from '@/store'
import { isLocationInItinerary } from '@/store/utils'

import type { DailyItinerary } from '@/types/itinerary'
import type { LocationID } from '@/types/location'
import type { Region } from '@/types/region'

import { dayjsToDate, stringToDate } from './date'
import { planItinerary } from './itinerary-plan'

type ItineraryPlanningArgs = Parameters<typeof planItinerary>

/**
 * Hook to manage a specific location in the itinerary for a given region.
 *
 * @param region - The region of the itinerary
 * @param location - The location ID
 * @returns A tuple containing: a boolean indicating if the location is in the itinerary, a function to add the location, and a function to remove the location.
 */
export const useItineraryItem = (
    region: Region,
    location: LocationID
): readonly [boolean, () => void, () => void] => {
    const { itineraries, addLocation, removeLocation } = useItineraryStore()
    return [
        // Whether the location is in the itinerary list
        isLocationInItinerary(itineraries[region], location),
        // Append the location to the itinerary list
        () => addLocation(region, location),
        // Remove the location from the itinerary list
        () => removeLocation(region, location)
    ] as const
}

/**
 * Hook to manage the duration of the itinerary for a given region.
 *
 * @param region - The region of the itinerary
 * @returns An object containing the start date, end date, and a function to set the duration.
 */
export const useItineraryDuration = (
    region: Region
): {
    /** The start date of the itinerary */
    start: string
    /** The end date of the itinerary */
    end: string
    /** Function to set the duration of the itinerary */
    setDuration: (start: string, end: string) => void
} => {
    const { itineraries, changeDates } = useItineraryStore()
    const { start: _start, locations } = itineraries[region]

    const start = stringToDate(_start) // Format assurance

    return {
        start,
        end: dayjsToDate(dayjs(start).add(locations.length - 1, 'day')),
        setDuration: (start: string, end: string) => changeDates(region, start, end)
    }
}

/**
 * Hook to get the itinerary list for a specific region.
 *
 * @param region - The region of the itinerary
 * @returns An object containing the itinerary list
 */
export const useItineraryList = (
    region: Region
): {
    /** The itinerary for each day */
    itinerary: DailyItinerary[]
    /** Function to arrange a location within the itinerary */
    arrangeLocation: (location: LocationID, day: number, index: number) => void
} => {
    const { itineraries, moveLocation } = useItineraryStore()
    const { start: _start, locations } = itineraries[region]

    const start = stringToDate(_start) // Format assurance

    return {
        itinerary: locations.map((dailyLocations, index) => ({
            date: dayjsToDate(dayjs(start).add(index, 'day')),
            locations: dailyLocations
        })),
        arrangeLocation: (location, day, index) => moveLocation(region, location, day, index)
    }
}

/**
 * Hook to optimize the itinerary.
 *
 * @param region - The region to plan for
 * @returns An object containing the planning function and loading state.
 */
export const useItineraryPlanning = (
    region: Region
): {
    /** Function to plan the itinerary */
    plan: () => Promise<void>
    /** Indicates whether the planning is in progress */
    loading: boolean
} => {
    const { itineraries, setLocations } = useItineraryStore()
    const { start, locations: locations } = itineraries[region]

    const onSuccess = (data: LocationID[][]) => {
        setLocations(region, data)
        showToast({
            type: 'success',
            message: {
                title: 'Itinerary updated',
                description: 'An optimised itinerary has been generated.'
            }
        })
    }

    const onError = (error: unknown) => {
        showToast({
            type: 'error',
            message: {
                title: 'Failed to generate itinerary',
                description: getAppErrorDescription(toAppError(error))
            }
        })
    }

    const { trigger, isMutating } = useSWRMutation(
        'plan-itinerary-' + region, // Key (Note: Using backticks causes type issues [why?])
        (_, { arg }: { arg: ItineraryPlanningArgs }) => planItinerary(...arg), // Mutation function
        { onSuccess, onError } // Options: Callbacks
    )

    const plan = async () => {
        // Prevent duplicate requests
        if (isMutating) return

        await trigger([
            start, // Start date
            locations.length, // Duration
            locations.flat() // Location IDs
        ])
    }

    return { plan, loading: isMutating }
}
