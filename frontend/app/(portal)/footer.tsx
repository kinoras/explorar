import Link from 'next/link'

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'

import { cn } from '@/lib/utils'

import { UpRightArrow } from './_components/up-right-arrow'

const PortalFooter = () => {
    return (
        <footer
            className={cn(
                'flex text-sm text-neutral-500',
                'mt-8 flex-col gap-4 px-2 py-8',
                'md:mt-10 md:flex-row md:items-center md:justify-between'
            )}
        >
            <div className="flex flex-col gap-0.5">
                <p className="font-semibold">Explore Hong Kong | Macau</p>
                <p className="italic">A travel itinerary planner for your next adventure.</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6">
                <p>&copy; {dayjs().year()}</p>
                <Link
                    href="https://github.com/ricky-lhy/explore-hk-mo"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-foreground inline-flex items-center gap-1 transition-colors"
                >
                    <FontAwesomeIcon icon={faGithub} />
                    <span>View Source</span>
                    <UpRightArrow align="top" />
                </Link>
            </div>
        </footer>
    )
}

export { PortalFooter }
