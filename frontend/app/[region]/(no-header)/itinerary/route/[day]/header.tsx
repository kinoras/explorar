import type { ComponentProps } from 'react'

import { PageHeader } from '@/components/custom/page-header'

import { RouteMethodToggle } from './_layout/method-toggle'

const RouteHeader = ({ children: closeButton, ...props }: ComponentProps<typeof PageHeader>) => {
    return (
        <PageHeader floating masking={240} {...props}>
            {closeButton}

            {/* Duration picker */}
            <RouteMethodToggle />
        </PageHeader>
    )
}

export { RouteHeader }
