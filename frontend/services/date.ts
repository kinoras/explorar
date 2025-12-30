import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

export const DATE_FORMAT = 'YYYY-MM-DD'

/**
 * Checks if a given date string is in correct date format.
 *
 * @param dateString - The date string to validate
 * @returns True if the date string is valid, false otherwise
 */
export const validateDate = (dateString: string): boolean => {
    return dayjs(dateString, DATE_FORMAT, true).isValid()
}

/**
 * Converts a string to ISO date, default to current date if invalid.
 *
 * @param dateString - The date string to convert
 * @returns The corresponding date if valid, otherwise the current date
 */
export const stringToDate = (dateString?: string): string => {
    return dateString && validateDate(dateString)
        ? dateString // Valid date, return as is
        : dayjs().format(DATE_FORMAT) // Invalid or missing date, return current date
}
