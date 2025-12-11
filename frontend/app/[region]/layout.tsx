import { redirect } from 'next/navigation'

import { Header } from '@/components/layout/header'

import { validateRegion } from '@/services/region'

import { defaultRegion } from '@/lib/config'

const RegionLayout = async ({ children, params }: LayoutProps<'/[region]'>) => {
    const { region } = await params

    // If the region is invalid, redirect to the default region
    if (!validateRegion(region)) {
        redirect(`/${defaultRegion}`)
    }

    return (
        <>
            <Header region={region} />
            {children}
        </>
    )
}

export default RegionLayout
