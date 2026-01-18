'use client'

import { SWRConfig } from 'swr'

import { type AppErrorCode, isAppError } from '@/lib/errors'

const NOT_RETRY_ERROR_CODES: AppErrorCode[] = [
    // 404 Not Found
    'LOCATION_NOT_FOUND',
    // 422 Unprocessable Entity
    'INVALID_DATE_FORMAT',
    'INVALID_DATE_RANGE',
    'INVALID_LOCATION_CURSOR',
    'INVALID_LOCATION_PAIRS'
] as const

export const SWRConfigProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <SWRConfig
            value={{
                // Disable revalidation on focus
                revalidateOnFocus: false,
                // Not retry for specific application errors
                shouldRetryOnError: (error) =>
                    !(isAppError(error) && NOT_RETRY_ERROR_CODES.includes(error.code))
            }}
        >
            {children}
        </SWRConfig>
    )
}
