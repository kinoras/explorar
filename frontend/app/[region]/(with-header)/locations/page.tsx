import { Suspense } from 'react'

import { LocationsActions } from '@/components/custom/locations-actions'
import { LocationsList } from '@/components/custom/locations-list'
import { Shelf, ShelfContent, ShelfHeader, ShelfTitle } from '@/components/ui/shelf'

import { stringToLocationSortOption } from '@/services/location-utils'
import { stringToRegion } from '@/services/region'

import { unifySearchParam } from '@/lib/utils'

import { CategoryTabs, CategoryTabsSkeleton } from './category-tabs'

const LocationsPage = async ({ params, searchParams }: PageProps<'/[region]/locations'>) => {
    // Extract and parse page props
    const { region: _region } = await params
    const { categories: _categories, sort: _sort } = await searchParams

    const region = stringToRegion(_region)
    const sort = stringToLocationSortOption(unifySearchParam(_sort)[0])
    const categories = unifySearchParam(_categories)
        .flatMap((c) => c.split(' '))
        .filter(Boolean)

    return (
        <main>
            <Shelf>
                <ShelfHeader>
                    <ShelfTitle>Browse Locations</ShelfTitle>
                    <LocationsActions sort={sort} />
                </ShelfHeader>
                <ShelfContent className="space-y-4.5">
                    <Suspense fallback={<CategoryTabsSkeleton />}>
                        <CategoryTabs region={region} activeCategories={categories} sort={sort} />
                    </Suspense>
                    <LocationsList region={region} categories={categories} sort={sort} />
                </ShelfContent>
            </Shelf>
        </main>
    )
}

export default LocationsPage
