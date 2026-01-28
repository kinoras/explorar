import type { Route as RouteResult, TravelMode } from '@/integrations/client'

import { defaultTransitMethod } from '@/lib/config'
import { transitMethods } from '@/lib/const'

import type { Route, TransitMethod } from '@/types/route'

/**
 * Validates if a string is a valid transit method.
 *
 * @param methodString - The transit method string to validate
 * @returns True if the transit method is valid, false otherwise
 */
const validateTransitMethod = (methodString: string): methodString is TransitMethod => {
    return transitMethods.includes(methodString as TransitMethod)
}

/**
 * Converts a travel mode string to a TransitMethod.
 *
 * @param mode - Travel mode as a string
 * @returns Corresponding transit method
 */
export const travelModeToTransitMethod = (mode: TravelMode): TransitMethod =>
    mode === 'drive' ? 'driving' : mode === 'walk' ? 'walking' : 'transit' // Default to 'transit'

/**
 * Converts a TransitMethod to a travel mode string.
 *
 * @param method - Transit method
 * @returns - Corresponding travel mode as a string
 */
export const transitMethodToTravelMode = (method: TransitMethod): TravelMode =>
    method === 'driving' ? 'drive' : method === 'walking' ? 'walk' : 'transit' // Default to 'transit'

/**
 * Converts a string to Location Sort Option, defaulting if invalid.
 *
 * @param optionString - The sort option string to convert
 * @returns The corresponding sort option if valid, otherwise the default sort option
 */
export const stringToTransitMethod = (optionString: string): TransitMethod => {
    return validateTransitMethod(optionString) ? optionString : defaultTransitMethod
}

export const processRoutesResult = (route: RouteResult): Route => {
    return {
        locations: {
            origin: route.origin,
            destination: route.destination
        },
        method: travelModeToTransitMethod(route.mode!),
        distance: route.distance,
        duration: route.duration,
        polyline: route.polyline
    }
}
