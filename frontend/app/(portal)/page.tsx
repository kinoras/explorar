import { PortalFeatures } from './features'
import { PortalFooter } from './footer'
import { PortalHeader } from './header'
import { PortalHero } from './hero'
import { PortalIntegrations } from './integrations'

const PortalPage = () => {
    return (
        <>
            <PortalHeader />
            <main className="flex min-h-dvh flex-col items-center gap-16 md:gap-18">
                <PortalHero />
                <PortalFeatures />
                <PortalIntegrations />
            </main>
            <PortalFooter />
        </>
    )
}

export default PortalPage
