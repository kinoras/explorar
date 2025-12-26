import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import type { LocationID } from '@/types/location'
import type { Region } from '@/types/region'

interface ItineraryState {
    /** Lists of location IDs for each region */
    itineraries: Record<Region, LocationID[]>
}

interface ItineraryActions {
    /** Add a location to the region's itinerary */
    addLocation: (region: Region, location: LocationID) => void

    /** Remove a location from the region's itinerary */
    removeLocation: (region: Region, location: LocationID) => void

    /** Clear all locations for a specific region */
    clearLocations: (region: Region) => void

    /** Set the locations for a region's itinerary */
    reorderLocations: (region: Region, locations: LocationID[]) => void
}

type ItineraryStore = ItineraryState & ItineraryActions

export const useItineraryStore = create<ItineraryStore>()(
    persist(
        (set, get) => ({
            itineraries: { hk: [], mo: [] }, // Initial state

            addLocation: (region, location) =>
                set((state) => {
                    // Don't add if already exists
                    if (state.itineraries[region].includes(location)) return state

                    return {
                        itineraries: {
                            ...state.itineraries,
                            [region]: [...state.itineraries[region], location]
                        }
                    }
                }),

            removeLocation: (region, location) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: state.itineraries[region].filter((id) => id !== location)
                    }
                })),

            clearLocations: (region) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: []
                    }
                })),

            reorderLocations: (region, locations) =>
                set((state) => ({
                    itineraries: {
                        ...state.itineraries,
                        [region]: locations
                    }
                }))
        }),
        {
            name: 'itinerary-storage',
            version: 1
        }
    )
)
