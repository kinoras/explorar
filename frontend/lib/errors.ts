import { hasErrorMessage } from './utils'

export type AppErrorCode =
    // 404
    | 'LOCATION_NOT_FOUND'
    // 422
    | 'INVALID_REGION'
    | 'INVALID_DATE_FORMAT'
    | 'INVALID_DATE_RANGE'
    | 'INVALID_LOCATION_CURSOR'
    | 'INVALID_LOCATION_PAIRS'
    // Non-HTTP
    | 'NETWORK'
    | 'TIMEOUT'
    | 'UNKNOWN'

export class AppError extends Error {
    code: AppErrorCode
    details?: string

    constructor(code: AppErrorCode, message?: string, details?: string) {
        super(message)
        this.code = code
        this.details = details
    }
}

/**
 * Checks if the given error is an instance of AppError.
 * @param e - The error to check.
 * @returns True if the error is an AppError, false otherwise.
 */
export const isAppError = (e: unknown): e is AppError => {
    return e instanceof AppError
}

/**
 * Converts an unknown error to an AppError.
 * @param e - The error to convert.
 * @returns The converted AppError.
 */
export const toAppError = (e: unknown): AppError => {
    // Already an AppError, return as is
    if (isAppError(e)) return e
    // Extract message if available
    const errorMessage = hasErrorMessage(e) ? e.message : String(e)
    return new AppError('UNKNOWN', errorMessage)
}

/**
 * Generates a user-friendly description for the given AppError.
 * @param error - The AppError instance.
 * @returns The error description.
 */
export const getAppErrorDescription = (error: AppError): string => {
    switch (error.code) {
        case 'LOCATION_NOT_FOUND':
            return 'The requested location could not be found.'
        case 'INVALID_DATE_FORMAT':
            return 'The provided date format is invalid.'
        case 'INVALID_DATE_RANGE':
            return 'Cannot search dates before 7 days ago or beyond 100 days from today.'
        case 'INVALID_REGION':
            return 'The specified region is invalid.'
        case 'INVALID_LOCATION_CURSOR':
            return 'The location cursor provided is invalid.'
        case 'INVALID_LOCATION_PAIRS':
            return 'All locations must be in the same region.'
        case 'NETWORK':
            return 'A network error occurred. Please check your connection.'
        case 'TIMEOUT':
            return 'The request timed out. Please try again later.'
        case 'UNKNOWN':
        default:
            return error.message || 'An unknown error occurred.'
    }
}
