'use client';

import { cn } from '@/helpers/common';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import * as React from 'react';

const ScrollArea = React.forwardRef<
    React.ElementRef<typeof ScrollAreaPrimitive.Viewport>,
    React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
        viewportRef?: React.RefObject<React.ElementRef<typeof ScrollAreaPrimitive.Viewport>>;
        onScroll?: React.UIEventHandler<HTMLDivElement>;
    }
>(({ className, children, viewportRef, onScroll, ...props }, ref) => (
    <ScrollAreaPrimitive.Root
        data-slot="scroll-area"
        className={cn('relative', className)}
        {...props}
    >
        <ScrollAreaPrimitive.Viewport
            ref={viewportRef || ref}
            onScroll={onScroll}
            data-slot="scroll-area-viewport"
            className="focus-visible:ring-ring/50 size-full rounded-[inherit] outline-none transition-[color,box-shadow] focus-visible:outline-1 focus-visible:ring-[3px]"
        >
            {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = 'ScrollArea';

function ScrollBar({
    className,
    orientation = 'vertical',
    ...props
}: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
    return (
        <ScrollAreaPrimitive.ScrollAreaScrollbar
            data-slot="scroll-area-scrollbar"
            orientation={orientation}
            className={cn(
                'flex touch-none select-none p-px transition-colors',
                orientation === 'vertical' &&
                    'h-full w-2.5 border-l border-l-transparent',
                orientation === 'horizontal' &&
                    'h-2.5 flex-col border-t border-t-transparent',
                className
            )}
            {...props}
        >
            <ScrollAreaPrimitive.ScrollAreaThumb
                data-slot="scroll-area-thumb"
                className="bg relative flex-1 rounded-full bg-zinc-300"
            />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
    );
}

export { ScrollArea, ScrollBar };
