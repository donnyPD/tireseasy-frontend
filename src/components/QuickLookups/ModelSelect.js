import React from 'react';
import Select from '@magento/venia-ui/lib/components/Select';
import { useModelList } from './useModelList';

/**
 * Component for selecting model from dropdown list
 * @param {Object} props - Component properties
 * @param {string} props.field - Field name for form
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number|null} props.year - Selected year for filtering models
 * @param {string|null} props.make - Selected make for filtering models
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} Model selection component
 */
const ModelSelect = ({ 
    field, 
    placeholder = "Select model", 
    required = false, 
    disabled = false,
    year = null,
    make = null,
    classes,
    ...restProps 
}) => {
    const { models, loading, error } = useModelList(year, make);

    /**
     * Get placeholder text based on current state
     * @returns {string} Placeholder text
     */
    const getPlaceholderText = () => {
        if (!year) return 'Select year first';
        if (!make) return 'Select make first';
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
        ...models.map((model) => ({ 
            value: model, 
            label: model 
        }))
    ];

    return (
        <>
            <Select
                {...restProps}
                field={field}
                items={items}
                disabled={disabled || loading || !year || !make}
                required={required}
                classes={classes}
                aria-label="Model selection"
            />
            {error && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Error loading models list
                </div>
            )}
        </>
    );
};

export default ModelSelect;
