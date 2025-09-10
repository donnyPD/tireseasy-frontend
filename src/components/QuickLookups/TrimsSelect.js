import React, { useEffect } from 'react';
import Select from '@magento/venia-ui/lib/components/Select';
import { useFormApi } from 'informed';
import { useTrims } from './useTrims';

/**
 * Component for selecting trim from dropdown list
 * @param {Object} props - Component properties
 * @param {string} props.field - Field name for form
 * @param {string} props.placeholder - Placeholder text
 * @param {boolean} props.required - Required field
 * @param {boolean} props.disabled - Disabled state
 * @param {number|null} props.year - Selected year for filtering trims
 * @param {string|null} props.make - Selected make for filtering trims
 * @param {string|null} props.model - Selected model for filtering trims
 * @param {Function} props.onTrimsLoaded - Callback when trims are loaded
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} Trim selection component
 */
const TrimsSelect = ({ 
    field, 
    placeholder = "Select trim", 
    required = false, 
    disabled = false,
    year = null,
    make = null,
    model = null,
    onTrimsLoaded = null,
    classes,
    ...restProps 
}) => {
    const { getTrims, trims, loading, error } = useTrims();
    const formApi = useFormApi();

    // Fetch trims when year, make, and model are available
    useEffect(() => {
        if (year && make && model) {
            getTrims(year, make, model).then((result) => {
                const trimsData = result?.data?.getTrims?.items || [];
                if (onTrimsLoaded) {
                    onTrimsLoaded(trimsData);
                }
                
                // Auto-select if only one trim available
                if (trimsData.length === 1 && formApi) {
                    formApi.setValue(field, trimsData[0]);
                }
            }).catch((err) => {
                console.error('Error loading trims:', err);
                if (onTrimsLoaded) {
                    onTrimsLoaded([]);
                }
            });
        } else {
            // Clear field when model is not selected
            if (formApi) {
                formApi.setValue(field, '');
            }
        }
    }, [year, make, model, getTrims, onTrimsLoaded, field]);

    /**
     * Get placeholder text based on current state
     * @returns {string} Placeholder text
     */
    const getPlaceholderText = () => {
        if (!year) return 'Select year first';
        if (!make) return 'Select make first';
        if (!model) return 'Select model first';
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
        ...trims.map((trim) => ({ 
            value: trim, 
            label: trim 
        }))
    ];

    return (
        <>
            <Select
                {...restProps}
                field={field}
                items={items}
                disabled={disabled || loading || !year || !make || !model}
                required={required}
                classes={classes}
                aria-label="Trim selection"
            />
            {error && (
                <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                    Error loading trims list
                </div>
            )}
        </>
    );
};

export default TrimsSelect;
