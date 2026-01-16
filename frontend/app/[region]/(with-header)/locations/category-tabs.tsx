import { RegionLink } from '@/components/atoms/region-link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { getCategoriesByRegion } from '@/services/category'

import { cn } from '@/lib/utils'

import type { CategoryKey } from '@/types/category'
import type { Region } from '@/types/region'

const CategoryTab = ({ active, href, name }: { active: boolean; href: string; name: string }) => (
    <Button
        size="sm"
        variant={active ? 'theme' : 'outline'}
        className={cn(
            'rounded-full shadow-none duration-100 ease-linear',
            active && 'border-theme border' // Also show border when active
        )}
        role="listitem"
        asChild
    >
        <RegionLink href={href}>{name}</RegionLink>
    </Button>
)

const CategoryTabs = async ({
    region,
    activeCategories
}: {
    /** The region to fetch categories for */
    region: Region
    /** The currently active categories */
    activeCategories: CategoryKey[]
}) => {
    const categories = await getCategoriesByRegion(region)

    return (
        <div
            className="-mx-4.5 flex items-center gap-2 overflow-x-scroll px-4.5 pb-1"
            style={{ scrollbarWidth: 'none' }}
            role="list"
        >
            <CategoryTab
                active={activeCategories.length === 0} // No active categories
                href="/locations"
                name="All"
            />

            <Separator orientation="vertical" className="mx-1 h-6!" />

            {categories.map(({ key, name }) => {
                const active = activeCategories.includes(key)

                // Build search params for the tab link
                const searchParams = new URLSearchParams()
                const newActiveCategories = active
                    ? activeCategories.filter((c) => c !== key) // Remove if active
                    : [...activeCategories, key] // Otherwise append
                if (newActiveCategories.length > 0)
                    searchParams.set('categories', newActiveCategories.join(' '))

                return (
                    <CategoryTab
                        key={key}
                        active={active}
                        href={`/locations?${searchParams.toString()}`}
                        name={name}
                    />
                )
            })}
        </div>
    )
}

const CategoryTabsSkeleton = ({ itemsCount = 3 }: { itemsCount?: number }) => {
    return (
        <div className="flex gap-2 overflow-hidden pb-1">
            {Array.from({ length: itemsCount }).map((_, index) => (
                <Skeleton key={index} className="h-8 w-20 rounded-full" />
            ))}
        </div>
    )
}

export { CategoryTabs, CategoryTabsSkeleton }
