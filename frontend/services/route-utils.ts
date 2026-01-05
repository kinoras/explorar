import type { RouteLegDto } from '@/integrations/client'

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
export const travelModeToTransitMethod = (mode: string): TransitMethod =>
    mode === 'Drive' ? 'driving' : mode === 'Walk' ? 'walking' : 'transit' // Default to 'transit'

/**
 * Converts a TransitMethod to a travel mode string.
 *
 * @param method - Transit method
 * @returns - Corresponding travel mode as a string
 */
export const transitMethodToTravelMode = (method: TransitMethod): string =>
    method === 'driving' ? 'Drive' : method === 'walking' ? 'Walk' : 'Transit' // Default to 'Transit'

/**
 * Converts a string to Location Sort Option, defaulting if invalid.
 *
 * @param optionString - The sort option string to convert
 * @returns The corresponding sort option if valid, otherwise the default sort option
 */
export const stringToTransitMethod = (optionString: string): TransitMethod => {
    return validateTransitMethod(optionString) ? optionString : defaultTransitMethod
}

/**
 * Converts a RouteLegDto to a Route object.
 *
 * @param leg - Route leg data transfer object
 * @returns Converted Route object
 */
export const routeLegToRoute = (leg: RouteLegDto): Route => ({
    locations: {
        origin: leg.fromPlaceId?.toString() ?? '', // This should never be missing...
        destination: leg.toPlaceId?.toString() ?? '' // and so should this
    },
    method: travelModeToTransitMethod(
        leg.steps?.every((step) => step.stepTravelMode === 'Walk')
            ? 'Walk' // All walking steps (to handle transit legs with only walking)
            : (leg.travelMode ?? '') // Otherwise use leg travel mode
    ),
    distance: leg.distance ?? -1,
    duration: leg.duration ?? -1
})
