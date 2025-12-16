import type { ComponentProps } from 'react'

import { faCheck, faChevronRight, faCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu'

import { cn } from '@/lib/utils'

const DropdownMenu = ({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Root>) => {
    return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

const DropdownMenuPortal = ({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Portal>) => {
    return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
}

const DropdownMenuTrigger = ({
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) => {
    return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

const DropdownMenuContent = ({
    className,
    sideOffset = 4,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) => {
    return (
        <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.Content
                data-slot="dropdown-menu-content"
                sideOffset={sideOffset}
                className={cn(
                    'bg-popover text-popover-foreground border-border rounded-xl border p-1 shadow-md', // Appearance
                    'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', // Entering animations
                    'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95', // Exiting animations
                    'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', // Animation directions
                    'z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto', // Positioning
                    className
                )}
                {...props}
            />
        </DropdownMenuPrimitive.Portal>
    )
}

const DropdownMenuGroup = ({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Group>) => {
    return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
}

const DropdownMenuItem = ({
    className,
    inset,
    variant = 'default',
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
    variant?: 'default' | 'destructive'
}) => {
    return (
        <DropdownMenuPrimitive.Item
            data-slot="dropdown-menu-item"
            data-inset={inset}
            data-variant={variant}
            className={cn(
                'relative flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none',
                "[&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // Icons
                'focus:bg-accent focus:text-accent-foreground', // Focus state
                /* Variants */
                'data-inset:pl-8', // Inset
                'data-disabled:pointer-events-none data-disabled:opacity-50', // Disabled
                'data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:text-destructive!', // Destructive

                className
            )}
            {...props}
        />
    )
}

const DropdownMenuCheckboxItem = ({
    className,
    children,
    checked,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>) => {
    return (
        <DropdownMenuPrimitive.CheckboxItem
            data-slot="dropdown-menu-checkbox-item"
            className={cn(
                'relative flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-sm outline-hidden select-none',
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // Icons
                'focus:bg-accent focus:text-accent-foreground', // Focus state
                'data-disabled:pointer-events-none data-disabled:opacity-50', // Disabled variant
                className
            )}
            checked={checked}
            {...props}
        >
            <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <FontAwesomeIcon icon={faCheck} className="size-3.5!" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.CheckboxItem>
    )
}

const DropdownMenuRadioGroup = ({
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) => {
    return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
}

const DropdownMenuRadioItem = ({
    className,
    children,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) => {
    return (
        <DropdownMenuPrimitive.RadioItem
            data-slot="dropdown-menu-radio-item"
            className={cn(
                'relative flex cursor-default items-center gap-2 rounded-lg py-1.5 pr-2 pl-8 text-sm outline-hidden select-none',
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // Icons
                'focus:bg-accent focus:text-accent-foreground', // Focus state
                'data-disabled:pointer-events-none data-disabled:opacity-50', // Disabled variant
                className
            )}
            {...props}
        >
            <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
                <DropdownMenuPrimitive.ItemIndicator>
                    <FontAwesomeIcon icon={faCircle} className="mb-0.75 size-2!" />
                </DropdownMenuPrimitive.ItemIndicator>
            </span>
            {children}
        </DropdownMenuPrimitive.RadioItem>
    )
}

const DropdownMenuLabel = ({
    className,
    inset,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
}) => {
    return (
        <DropdownMenuPrimitive.Label
            data-slot="dropdown-menu-label"
            data-inset={inset}
            className={cn('px-2 py-1.5 text-sm font-medium data-inset:pl-8', className)}
            {...props}
        />
    )
}

const DropdownMenuSeparator = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.Separator>) => {
    return (
        <DropdownMenuPrimitive.Separator
            data-slot="dropdown-menu-separator"
            className={cn('bg-border -mx-1 my-1 h-px', className)}
            {...props}
        />
    )
}

const DropdownMenuShortcut = ({ className, ...props }: ComponentProps<'span'>) => {
    return (
        <span
            data-slot="dropdown-menu-shortcut"
            className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
            {...props}
        />
    )
}

const DropdownMenuSub = ({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Sub>) => {
    return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

const DropdownMenuSubTrigger = ({
    className,
    inset,
    children,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
}) => {
    return (
        <DropdownMenuPrimitive.SubTrigger
            data-slot="dropdown-menu-sub-trigger"
            data-inset={inset}
            className={cn(
                "[&_svg:not([class*='text-'])]:text-muted-foreground flex cursor-default items-center gap-2 rounded-lg px-2 py-1.5 text-sm outline-hidden select-none",
                "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", // Icons
                'data-inset:pl-8', // Inset variant
                /* States */
                'data-[state=open]:bg-accent data-[state=open]:text-accent-foreground', // Opening
                'focus:bg-accent focus:text-accent-foreground', // Focus
                className
            )}
            {...props}
        >
            {children}
            <FontAwesomeIcon icon={faChevronRight} className="ml-auto size-4" />
        </DropdownMenuPrimitive.SubTrigger>
    )
}

const DropdownMenuSubContent = ({
    className,
    ...props
}: ComponentProps<typeof DropdownMenuPrimitive.SubContent>) => {
    return (
        <DropdownMenuPrimitive.SubContent
            data-slot="dropdown-menu-sub-content"
            className={cn(
                'bg-popover text-popover-foreground rounded-xl border p-1 shadow-lg', // Appearance
                'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95', // Entering animations
                'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95', // Exiting animations
                'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2', // Animation directions
                'z-50 min-w-32 origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden', // Positioning
                className
            )}
            {...props}
        />
    )
}

export {
    DropdownMenu,
    DropdownMenuPortal,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuLabel,
    DropdownMenuItem,
    DropdownMenuCheckboxItem,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
}
