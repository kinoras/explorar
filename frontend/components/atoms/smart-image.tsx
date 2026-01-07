'use client'

import type { ComponentProps } from 'react'
import { useEffect, useState } from 'react'

import Image from 'next/image'

const SmartImage = ({
    fallback,
    src,
    alt,
    ...props
}: ComponentProps<typeof Image> & {
    /** Fallback src if the main src fails to load. */
    fallback?: typeof src
}) => {
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        setError(false)
    }, [src])

    return (
        <Image
            src={error && fallback ? fallback : src} // Show fallback on src load error if provided
            onError={() => setError(true)}
            alt={alt}
            {...props}
        />
    )
}

export { SmartImage }
