import { Children, type CSSProperties, type ReactNode } from 'react';

type HorizontalScrollCarouselProps<T> = {
    /** Optional data source when you prefer render-prop usage instead of passing children. */
    items?: readonly T[];
    /** Render function for each item in `items`. */
    renderItem?: (item: T, index: number) => ReactNode;
    /** Any card elements to place in the carousel/grid. */
    children?: ReactNode;
    /** Additional classes for the outer carousel/grid wrapper. */
    className?: string;
    /** Additional classes applied to every snap/grid item wrapper. */
    itemClassName?: string;
    /** Accessible label for the horizontally scrollable region on mobile/tablet. */
    ariaLabel?: string;
    /** Desktop column count used by the grid fallback. */
    desktopColumns?: 2 | 3 | 4;
    /** Mobile card width. Use 80vw/85vw to create the peek effect. */
    mobileCardWidth?: string;
    /** Gap between cards. */
    gap?: string;
};

const desktopColumnClass = {
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
} satisfies Record<NonNullable<HorizontalScrollCarouselProps<unknown>['desktopColumns']>, string>;

/**
 * Generic mobile/tablet horizontal scroll wrapper with native CSS scroll snap.
 * On desktop it falls back to a regular CSS grid so the same component can be
 * reused for articles, tours, testimonials, products, or any other card type.
 */
export default function HorizontalScrollCarousel<T>({
    items,
    renderItem,
    children,
    className = '',
    itemClassName = '',
    ariaLabel = 'Danh sách thẻ có thể cuộn ngang',
    desktopColumns = 3,
    mobileCardWidth = '85vw',
    gap = '1.5rem',
}: HorizontalScrollCarouselProps<T>) {
    const content = items && renderItem ? items.map(renderItem) : Children.toArray(children);

    return (
        <div
            className={`horizontal-scroll-carousel ${desktopColumnClass[desktopColumns]} ${className}`.trim()}
            role="region"
            aria-label={ariaLabel}
            style={{ '--carousel-card-width': mobileCardWidth, '--carousel-gap': gap } as CSSProperties}
        >
            {content.map((child, index) => (
                <div key={index} className={`horizontal-scroll-carousel__item ${itemClassName}`.trim()}>
                    {child}
                </div>
            ))}
        </div>
    );
}
