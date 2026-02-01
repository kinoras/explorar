import { CategoryTile, CategoryTileSkeleton } from '@/components/custom/category-tile'

import { getCategoriesByRegion } from '@/services/category'

import { getAppErrorDescription, toAppError } from '@/lib/errors'

import type { Region } from '@/types/region'

import CategoriesError from './categories-error'

const Categories = async ({ region }: { region: Region }) => {
    try {
        const categories = await getCategoriesByRegion(region)

        return (
            <>
                {categories.map(({ key, name, image, count }) => (
                    <CategoryTile
                        key={key}
                        identifier={key}
                        // Data fields below
                        name={name}
                        image={image}
                        count={count}
                    />
                ))}
            </>
        )
    } catch (error) {
        return <CategoriesError message={getAppErrorDescription(toAppError(error))} />
    }
}

const CategoriesSkeleton = ({ itemsCount }: { itemsCount: number }) => {
    return (
        <>
            {Array.from({ length: itemsCount }).map((_, index) => (
                <CategoryTileSkeleton key={index} />
            ))}
        </>
    )
}

export { Categories, CategoriesSkeleton }
