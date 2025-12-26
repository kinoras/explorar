import Link from 'next/link'

import { DataList, DataListSkeleton } from '../_components/list'
import { DataSection, DataSectionSkeleton } from '../_components/section'

const PhoneLink = ({ phone }: { phone: string }) => (
    <Link href={`tel:${phone}`} className="text-theme tabular-nums">
        {phone}
    </Link>
)
const WebsiteLink = ({ website }: { website: string }) => (
    <Link href={website} target="_blank" rel="noopener noreferrer" className="text-theme">
        {website}
    </Link>
)

const LocationContact = ({ phone, website }: { phone?: string; website?: string }) => (
    <DataSection title="Contact">
        <DataList
            className="[&_span]:line-clamp-1"
            items={[
                ...(phone ? [{ key: 'Phone', value: <PhoneLink phone={phone} /> }] : []),
                ...(website ? [{ key: 'Website', value: <WebsiteLink website={website} /> }] : [])
            ]}
        />
    </DataSection>
)

const LocationContactSkeleton = () => (
    <DataSectionSkeleton>
        <DataListSkeleton />
    </DataSectionSkeleton>
)

export { LocationContact, LocationContactSkeleton }
