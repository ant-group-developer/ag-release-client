import { cn } from '@/helpers/common';

interface DropdownItemProps
    extends React.DetailedHTMLProps<
        React.LiHTMLAttributes<HTMLLIElement>,
        HTMLLIElement
    > {}

export function DropdownItem({
    children,
    className,
    ...props
}: DropdownItemProps) {
    return (
        <li
            {...props}
            className={cn(
                'cursor-pointer px-6 py-1.5 hover:bg-gray-100',
                className
            )}
        >
            {children}
        </li>
    );
}
