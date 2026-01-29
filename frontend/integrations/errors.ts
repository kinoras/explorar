import type { ErrorCode, ErrorDetails, ErrorModel } from './client'

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const isErrorModel = (error: unknown): error is ErrorModel => {
    return isObject(error) && typeof error.status === 'number' && typeof error.message === 'string'
}

export const getErrorCode = (error: unknown): ErrorCode | undefined => {
    return isErrorModel(error) ? error.code : undefined
}
export const getErrorMessage = (error: unknown): string | undefined => {
    return isErrorModel(error) ? (error.message ?? undefined) : undefined
}

export const getErrorDetails = (error: unknown): ErrorDetails | undefined => {
    return isErrorModel(error) ? (error.details ?? undefined) : undefined
}
