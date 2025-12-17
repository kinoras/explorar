import type { ComponentProps } from 'react'

import Link from 'next/link'

import type { Region } from '@/services/region'

import { getAppConfigByRegion } from '@/lib/config'
import { cn } from '@/lib/utils'

const Azulejo = ({ className, image, ...props }: ComponentProps<'span'> & { image: string }) => (
    <span
        className={cn('h-6 bg-size-[24px]', className)}
        style={{ backgroundImage: `url('${image}')` }}
        {...props}
    />
)

const Header = ({ className, region, ...props }: ComponentProps<'header'> & { region: Region }) => {
    const config = getAppConfigByRegion(region)

    return (
        <header className={cn('my-6 flex items-end gap-2.5', className)} {...props}>
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
                <img src={config.logo} className="h-6" alt="" />
                <span className="sr-only">{config.title}</span>
            </Link>

            {/* Right azulejos */}
            <Azulejo className="flex-1" image={config.pattern} />
        </header>
    )
}

export { Header }
