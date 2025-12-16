import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Builds a Tailwind-friendly className string.
 * @param inputs - Class values to combine and merge
 * @returns Merged className string
 */
export const cn = (...inputs: ClassValue[]) => {
    return twMerge(clsx(inputs))
}

/**
 * Normalizes a Next.js search param to a string array.
 * @param param - Search param value (string, string[], or undefined)
 * @returns Array of string values
 */
export const unifySearchParam = (param: string | string[] | undefined): string[] => {
    switch (typeof param) {
        case 'undefined':
            return []
        case 'string':
            return [param]
        default: // string[]
            return param
    }
}
