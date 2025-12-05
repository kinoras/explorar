import type { ComponentProps } from 'react'

import Link from 'next/link'

import { cn } from '@/lib/utils'

const Azulejo = ({ className, ...props }: ComponentProps<'span'>) => (
    <span
        className={cn('h-6 bg-size-[24px]', className)}
        style={{ backgroundImage: "url('/assets/brand/azulejo.svg')" }}
        {...props}
    />
)

const Header = ({ className, ...props }: ComponentProps<'header'>) => {
    return (
        <header
            className={cn('flex items-end gap-2.5 py-6', className)}
            {...props}
        >
            {/* Left azulejos */}
            <Azulejo className="basis-2 -scale-x-100" />

            <Link
                href="/"
                className={cn(
                    'relative pt-8.5',
                    'before:absolute before:top-0 before:h-6 before:w-36',
                    'before:bg-size-[auto_24px] before:bg-no-repeat',
                    `before:bg-[url('/assets/brand/explore.svg')]`
                )}
            >
                <img src="/assets/brand/macau.svg" className="h-6" alt="" />
                <span className="sr-only">Explore Macau</span>
            </Link>

            {/* Right azulejos */}
            <Azulejo className="flex-1" />
        </header>
    )
}

export { Header }