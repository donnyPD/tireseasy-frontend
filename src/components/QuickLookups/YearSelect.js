import React from 'react';
import Select from '@magento/venia-ui/lib/components/Select';
import { useYearList } from './useYearList';

/**
 * Component for selecting year from dropdown list
 * @param {Object} props - Component properties
 * @param {string} props.field - Field name for form
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} Year selection component
 */
const YearSelect = ({ 
    field, 
    placeholder = "Select year", 
    required = false, 
    disabled = false,
    classes,
    ...restProps 
}) => {
    const { years, loading, error } = useYearList();

    // Prepare items for Venia Select component
    const items = [
        { 
            value: '', 
            label: loading ? 'Loading...' : placeholder, 
            disabled: true 
        },
        ...years.map((year) => ({ 
            value: year, 
            label: year.toString() 
        }))
    ];

    return (
        <>
            <Select
                {...restProps}
                field={field}
                items={items}
                disabled={disabled || loading}
                required={required}
                classes={classes}
                aria-label="Year selection"
            />
            {error && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Error loading years list
                </div>
            )}
        </>
    );
};

export default YearSelect;
