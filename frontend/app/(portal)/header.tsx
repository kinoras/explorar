import Image from 'next/image'
import Link from 'next/link'

import { faGithub } from '@fortawesome/free-brands-svg-icons'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { UpRightArrow } from './_components/up-right-arrow'

const regionLinks = [
    { href: '/hk', name: 'Hong Kong' },
    { href: '/mo', name: 'Macau' }
]

const PortalHeader = () => {
    return (
        <header className="flex h-20 items-center justify-between pl-2 md:mb-6">
            <Link href="/" className="transition-opacity hover:opacity-80">
                <h1 className="sr-only">Explore Hong Kong | Macau</h1>
                <Image src="/assets/brand/logo.svg" alt="" width={32} height={32} priority />
            </Link>

            <nav className="flex h-5 items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="theme" className="h-8.5 rounded-full px-4! font-semibold">
                            Start Exploring
                            <FontAwesomeIcon
                                icon={faChevronDown}
                                size="xs"
                                className="-mr-1 -ml-0.5"
                            />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {regionLinks.map(({ href, name }) => (
                            <DropdownMenuItem key={href} asChild>
                                <Link href={href} className="flex cursor-pointer justify-between">
                                    {name}
                                    <UpRightArrow align="top" />
                                </Link>
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button asChild size="icon" variant="ghost" className="rounded-full shadow-none">
                    <Link
                        href="https://github.com/ricky-lhy/explore-hk-mo"
                        target="_blank"
                        rel="noreferrer"
                        aria-label="GitHub Repository"
                    >
                        <FontAwesomeIcon icon={faGithub} size="xl" />
                    </Link>
                </Button>
            </nav>
        </header>
    )
}

export { PortalHeader }
