import React from 'react';
import Select from '@magento/venia-ui/lib/components/Select';
import { useMakeList } from './useMakeList';

/**
 * Component for selecting make from dropdown list
 * @param {Object} props - Component properties
 * @param {string} props.field - Field name for form
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number|null} props.year - Selected year for filtering makes
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} Make selection component
 */
const MakeSelect = ({ 
    field, 
    placeholder = "Select make", 
    required = false, 
    disabled = false,
    year = null,
    classes,
    ...restProps 
}) => {
    const { makes, loading, error } = useMakeList(year);

    // Get placeholder text based on current state
    const getPlaceholderText = () => {
        if (!year) return 'Select year first';
        if (loading) return 'Loading...';
        return placeholder;
    };

    // Prepare items for Venia Select component
    const items = [
        { 
            value: '', 
            label: getPlaceholderText(), 
            disabled: true 
        },
        ...makes.map((make) => ({ 
            value: make, 
            label: make 
        }))
    ];

    return (
        <>
            <Select
                {...restProps}
                field={field}
                items={items}
                disabled={disabled || loading || !year}
                required={required}
                classes={classes}
                aria-label="Make selection"
            />
            {error && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Error loading makes list
                </div>
            )}
        </>
    );
};

export default MakeSelect;
