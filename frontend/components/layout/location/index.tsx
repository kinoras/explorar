import type { ComponentProps } from 'react'

import { Separator } from '@/components/ui/separator'

import type { Location } from '@/services/location/utils'

import { cn } from '@/lib/utils'

import { LocationCarousel, LocationCarouselSkeleton } from './carousel'
import { LocationContact, LocationContactSkeleton } from './contact'
import { LocationdDescription, LocationdDescriptionSkeleton } from './description'
import { LocationFooter, LocationFooterSkeleton } from './footer'
import { LocationHours } from './hours'
import { LocationMap, LocationMapSkeleton } from './map'
import { LocationMeta, LocationMetaSkeleton } from './meta'

const blockStyles = {
    root: 'flex min-h-full w-full flex-col',
    content: 'px-4.5',
    spacer: 'flex-1 basis-2'
}

// Placeholder spacer to push footer to bottom
const Spacer = () => <span className={blockStyles.spacer} />

const LocationLayout = ({
    location: {
        name,
        description,
        category,
        images,
        rating,
        position: { address, coordinates },
        contacts: { phone, website },
        hours
    },
    className,
    ...props
}: ComponentProps<'div'> & {
    location: Location
}) => (
    <div className={cn(blockStyles.root, className)} {...props}>
        <LocationCarousel images={images} />

        <div className={blockStyles.content}>
            <LocationMeta name={name} category={category.name} rating={rating} address={address} />
            <Separator />
            {description && <LocationdDescription description={description} />}
            {coordinates && <LocationMap coordinates={coordinates} />}
            {(phone || website) && <LocationContact phone={phone} website={website} />}
            <LocationHours hours={hours} />
        </div>

        <Spacer />

        <LocationFooter />
    </div>
)

const LocationLayoutSkeleton = ({ className, ...props }: ComponentProps<'div'>) => (
    <div className={cn(blockStyles.root, className)} {...props}>
        <LocationCarouselSkeleton />

        <div className={blockStyles.content}>
            <LocationMetaSkeleton />
            <Separator />
            <LocationdDescriptionSkeleton />
            <LocationMapSkeleton />
            <LocationContactSkeleton />
        </div>

        <Spacer />

        <LocationFooterSkeleton />
    </div>
)

export { LocationLayout, LocationLayoutSkeleton }
