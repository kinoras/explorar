'use client'

import type { ComponentProps } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { getAppConfigByRegion } from '@/lib/config'
import { useRegion } from '@/lib/context'
import { cn } from '@/lib/utils'

const Azulejo = ({ className, image, ...props }: ComponentProps<'span'> & { image: string }) => (
    <span
        className={cn('h-6 bg-size-[24px]', className)}
        style={{ backgroundImage: `url('${image}')` }}
        {...props}
    />
)

const Header = ({ className, ...props }: ComponentProps<'header'>) => {
    const { region } = useRegion()
    const config = getAppConfigByRegion(region)

    return (
        <header className={cn('mt-6 flex items-end gap-2.5', className)} {...props}>
            {/* Left azulejos */}
            <Azulejo className="basis-2 -scale-x-100" image={config.pattern} />

            <Link
                href={`/${region}`}
                className={cn(
                    'relative pt-8.5',
                    'before:absolute before:top-0 before:h-6 before:w-36',
                    'before:bg-size-[auto_24px] before:bg-no-repeat',
                    `before:bg-[url('/assets/brand/explore.svg')]`
                )}
            >
                <Image src={config.logo} className="h-6 w-auto!" height={24} width={200} alt="" />
                <span className="sr-only">{config.title}</span>
            </Link>

            {/* Right azulejos */}
            <Azulejo className="flex-1" image={config.pattern} />
        </header>
    )
}

export { Header }
