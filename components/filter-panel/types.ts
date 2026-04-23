import { ReactNode } from 'react';

/**
 * Filter content types supported by the FilterPanel
 */
export type FilterType = 'checkbox' | 'dateRange' | 'input';

/**
 * Option item for checkbox filters
 */
export interface FilterOption {
    label: string;
    value: string;
}

/**
 * Configuration for a single filter category
 */
export interface FilterConfig {
    /** Unique key for this filter */
    key: string;
    /** Display label in the category list */
    label: string;
    /** Icon shown before the label */
    icon?: ReactNode;
    /** Type of filter content to render */
    type: FilterType;
    /**
     * Key(s) in the dataFilter object this filter maps to.
     * - Single string for checkbox/input: e.g. 'status'
     * - Tuple for dateRange: e.g. ['startCreatedAt', 'endCreatedAt']
     */
    filterKey: string | [string, string];
    /**
     * Options for checkbox filter type.
     * Can be a static array or will be provided dynamically.
     */
    options?: FilterOption[];
    /** Placeholder text for input/search within the filter */
    placeholder?: string;
    /** Whether options are loading (for async data) */
    loading?: boolean;
    /** Whether the checkbox values are comma-separated strings in the URL */
    isCommaSeparated?: boolean;
}

/**
 * Props for the main FilterPanel component
 */
export interface FilterPanelProps<TFilter extends Record<string, any>> {
    /** Filter configuration array */
    configs: FilterConfig[];
    /** Current filter data from useFilter */
    dataFilter: TFilter;
    /** Callback to change filter values */
    onChangeFilter: (newValue: Partial<TFilter>, backToFirstPage?: boolean) => void;
    /** Callback to remove all filters */
    removeFilter: () => void;
    /** Whether filters can be cleared (any active filter) */
    canClearFilter: boolean;
    /** Optional CSS class */
    className?: string;
}
