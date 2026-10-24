import type { ComponentProps, ReactNode } from 'react'

import { cn } from '@/lib/utils'

const PortalSection = ({ className, ...props }: ComponentProps<'section'>) => (
    <section className={cn('flex flex-col gap-6 px-2 md:gap-8', className)} {...props} />
)

const PortalSectionHeader = ({
    title,
    description,
    className,
    ...props
}: ComponentProps<'div'> & {
    title: ReactNode
    description: ReactNode
}) => (
    <div className={cn('flex flex-col gap-2 text-balance md:col-span-2', className)} {...props}>
        <h2 className="-ml-px text-4xl font-bold tracking-tight md:text-[40px]">{title}</h2>
        <p className="md:text-lg">{description}</p>
    </div>
)

const PortalSectionContent = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn('grid grid-cols-1 gap-6', className)} {...props} />
)

const PortalSectionItem = ({ className, ...props }: ComponentProps<'article'>) => (
    <article
        className={cn(
            'rounded-2xl bg-accent/80', // Appearance
            '-mx-px flex flex-col items-start gap-1.25 p-5.5', // Layout
            '[&_svg]:mb-1.5 [&_svg]:-ml-px [&_svg]:text-xl [&_svg]:text-theme', // Icon
            '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:tracking-tight [&_h3]:md:text-xl', // Title
            className
        )}
        {...props}
    />
)

export { PortalSection, PortalSectionHeader, PortalSectionContent, PortalSectionItem }
