import { Skeleton } from '@/components/ui/skeleton'

import { DataSection, DataSectionSkeleton } from '../_components/section'

const LocationDescription = ({ description }: { description: string }) => (
    <DataSection title="About">
        <p className="text-sm leading-normal">{description}</p>
    </DataSection>
)

const LocationDescriptionSkeleton = () => (
    <DataSectionSkeleton>
        <Skeleton className="mb-1.75 h-3.75 w-full" />
        <Skeleton className="h-3.75 w-5/6" />
    </DataSectionSkeleton>
)

export { LocationDescription, LocationDescriptionSkeleton }
