import { NaviButton } from '@/components/atoms/navi-button'

const LocationPageHeader = ({ region }: { region: string }) => {
    return (
        <header className="fixed inset-x-0 top-0 z-50 p-4 pb-6">
            <NaviButton appearance="back" href={`/${region}`} />
        </header>
    )
}

export { LocationPageHeader }
