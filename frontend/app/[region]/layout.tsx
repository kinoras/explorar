import { redirect } from 'next/navigation'

import { validateRegion } from '@/services/region'

import { defaultRegion } from '@/lib/config'

const RegionLayout = async ({ children, modal, params }: LayoutProps<'/[region]'>) => {
    const { region } = await params

    // If the region is invalid, redirect to the default region
    if (!validateRegion(region)) {
        redirect(`/${defaultRegion}`)
    }

    return (
        <>
            {modal}
            {children}
        </>
    )
}

export default RegionLayout
