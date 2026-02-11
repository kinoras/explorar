import Image from 'next/image'

import {
    PortalSection,
    PortalSectionContent,
    PortalSectionHeader,
    PortalSectionItem
} from './_components/section'

const integrations = [
    {
        id: 'tripadvisor',
        title: 'Tripadvisor',
        description: 'Trusted reviews, photos, and ratings powered by Tripadvisor.',
        image: '/assets/portal/integrations-tripadvisor.svg'
    },
    {
        id: 'maps',
        title: 'Google Maps',
        description: 'Reliable travel times and route paths from Google Maps.',
        image: '/assets/portal/integrations-maps.svg'
    },
    {
        id: 'gemini',
        title: 'Google Gemini',
        description: 'AI-powered trip ideas and smart itineraries.',
        image: '/assets/portal/integrations-gemini.svg'
    }
]

const PortalIntegrations = () => {
    return (
        <PortalSection>
            <PortalSectionHeader
                title="Integrations"
                description="Smart and reliable tools for your journey."
            />
            <PortalSectionContent className="md:grid-cols-3">
                {integrations.map(({ id, title, description, image }) => (
                    <PortalSectionItem key={id}>
                        <Image src={image} alt="" className="size-7.5" height={30} width={30} />
                        <h3 className="mt-1">{title}</h3>
                        <p>{description}</p>
                    </PortalSectionItem>
                ))}
            </PortalSectionContent>
        </PortalSection>
    )
}

export { PortalIntegrations }
