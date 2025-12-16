import { Suspense } from 'react'

import { faChevronRight, faUpDown } from '@fortawesome/free-solid-svg-icons'
import { parse } from 'path'

import {
    Shelf,
    ShelfActionButton,
    ShelfActions,
    ShelfContent,
    ShelfHeader,
    ShelfTitle
} from '@/components/ui/shelf'

import { parseSortOption } from '@/services/location/sort'
import { type Region, parseRegion } from '@/services/region'

import { unifySearchParam } from '@/lib/utils'

import { Categories, CategoriesSkeleton } from './categories'
import { Locations, LocationsSkeleton } from './locations'
import { LocationsActions } from './locations-actions'

const Home = async ({ params, searchParams }: PageProps<'/[region]'>) => {
    // Extract and parse page props
    const region = await params.then(({ region }) => parseRegion(region))
    const sort = await searchParams.then(({ sort }) => parseSortOption(unifySearchParam(sort)[0]))

    return (
        <main>
            <Shelf>
                <ShelfHeader>
                    <ShelfTitle>by Category</ShelfTitle>
                    <ShelfActions>
                        <ShelfActionButton
                            icon={faChevronRight}
                            aria-label="Browse all categories"
                        />
                    </ShelfActions>
                </ShelfHeader>
                <ShelfContent
                    className="flex gap-x-2.5 overflow-x-scroll *:shrink-0 *:basis-[calc(50%-5px)]!"
                    style={{ scrollbarWidth: 'none' }}
                >
                    <Suspense fallback={<CategoriesSkeleton itemsCount={2} />}>
                        <Categories region={region} />
                    </Suspense>
                </ShelfContent>
            </Shelf>

            <Shelf>
                <ShelfHeader>
                    <ShelfTitle>by Location</ShelfTitle>
                    <LocationsActions sort={sort} />
                </ShelfHeader>
                <ShelfContent className="space-y-4.5">
                    <Suspense key={sort} fallback={<LocationsSkeleton itemsCount={4} />}>
                        <Locations region={region} sort={sort} />
                    </Suspense>
                </ShelfContent>
            </Shelf>
        </main>
    )
}

export default Home
