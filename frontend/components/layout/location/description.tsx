import { DataSection, DataSectionSkeleton } from '@/components/atoms/data-section'
import { Skeleton } from '@/components/ui/skeleton'

const LocationdDescription = ({ description }: { description: string }) => (
    <DataSection title="About">
        <p className="text-sm leading-normal">{description}</p>
    </DataSection>
)

const LocationdDescriptionSkeleton = () => (
    <DataSectionSkeleton>
        <Skeleton className="mb-1.75 h-3.75 w-full" />
        <Skeleton className="h-3.75 w-5/6" />
    </DataSectionSkeleton>
)

export { LocationdDescription, LocationdDescriptionSkeleton }
