import dayjs from 'dayjs'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { stringToDate } from '@/services/date'

import type { Itinerary } from '@/types/itinerary'
import type { LocationID } from '@/types/location'
import type { Region } from '@/types/region'

import {
    addLocationToItinerary,
    createEmptyItinerary,
    isLocationInItinerary,
    mergeDailyItineraries,
    removeLocationFromItinerary
} from './utils'

type ItineraryState = {
    /** Itineraries for each region */
    itineraries: Record<Region, Itinerary>
}

type ItineraryActions = {
    /** Add a location to the region's itinerary */
    addLocation: (region: Region, location: LocationID) => void

    /** Remove a location from the region's itinerary */
    removeLocation: (region: Region, location: LocationID) => void

    /** Clear all locations for a specific region */
    clearLocations: (region: Region) => void

    /** Change the start and end dates of the itinerary for a specific region */
    changeDates: (region: Region, start: string, end: string) => void
}

type ItineraryStore = ItineraryState & ItineraryActions

export const useItineraryStore = create<ItineraryStore>()(
    persist(
        (set) => ({
            itineraries: {
                hk: createEmptyItinerary(),
                mo: createEmptyItinerary()
            },

            addLocation: (region, location) =>
                set((state) => {
                    // Don't add if already exists
                    if (isLocationInItinerary(state.itineraries[region], location)) return state

                    return {
                        itineraries: {
                            ...state.itineraries,
                            [region]: addLocationToItinerary(state.itineraries[region], location)
                        }
                    }
                }),

            removeLocation: (region, location) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: removeLocationFromItinerary(state.itineraries[region], location)
                    }
                })),

            clearLocations: (region) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: createEmptyItinerary(
                            state.itineraries[region].start, // Preserve start date
                            state.itineraries[region].locations.length // Preserve duration (number of days)
                        )
                    }
                })),

            changeDates: (region, start, end) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: {
                            start: stringToDate(start),
                            locations: mergeDailyItineraries(
                                state.itineraries[region].locations, // Locations
                                dayjs(end).diff(dayjs(start), 'day') + 1 // Duration: both ends inclusive
                            )
                        }
                    }
                }))
        }),
        {
            name: 'itinerary-storage',
            version: 1
        }
    )
)
