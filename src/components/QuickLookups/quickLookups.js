import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Form, Text } from 'informed';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useHistory } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Field from '@magento/venia-ui/lib/components/Field';
import YearSelect from './YearSelect';
import MakeSelect from './MakeSelect';
import ModelSelect from './ModelSelect';
import { useOptions } from './useOptions';
import { useVinLookup, validateVin } from './useVinLookup';
import defaultClasses from './quickLookups.module.css';

/**
 * QuickLookups component with Vehicle Lookup and VIN Lookup forms
 * @param {Object} props - Component props
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} QuickLookups component
 */
const QuickLookups = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const history = useHistory();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [vinError, setVinError] = useState('');
    const { getOptions, data: optionsData, loading: optionsLoading, error: optionsError, options } = useOptions();
    const { getOptionsByVin, loading: vinLoading, error: vinQueryError } = useVinLookup();

    /**
     * Handle year selection change
     * @param {Event} event - Change event
     */
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // Reset make and model selection when year changes
        setSelectedMake('');
        setSelectedModel('');
    };

    /**
     * Handle make selection change
     * @param {Event} event - Change event
     */
    const handleMakeChange = (event) => {
        setSelectedMake(event.target.value);
        // Reset model selection when make changes
        setSelectedModel('');
    };

    /**
     * Handle model selection change
     * @param {Event} event - Change event
     */
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
    };

    /**
     * Handle Vehicle Lookup form submission
     * Behavior based on number of results:
     * - 0 results: Show "No results" message
     * - 1 result: Navigate directly to tire listing URL
     * - Multiple results: Navigate to vehicle-lookup-trims page
     * @param {Object} values - Form values
     */
    const handleVehicleSubmit = async (values) => {
        console.log('Vehicle Lookup Form Data:', values);

        try {
            // Get options using selected year, make and model
            const result = await getOptions(selectedYear, selectedMake, selectedModel);

            // Check if we have multiple tire size options
            const tireOptions = result?.data?.getOptions?.items || [];

            if (tireOptions.length === 1) {
                // Single result: navigate directly to the tire listing page
                const singleOption = tireOptions[0];
                console.log('Single tire option found, navigating directly to:', singleOption.url);
                console.log('Single option details:', singleOption);

                // Navigate directly to the tire listing page
                history.push(singleOption.url);

            } else if (tireOptions.length > 1) {
                // Multiple results: navigate to vehicle-lookup-trims page with vehicle info and tire options
                const vehicleInfo = {
                    year: selectedYear,
                    make: selectedMake,
                    model: selectedModel
                };

                // Convert tire options to the format expected by VehicleLookupTrims
                const tireSizes = tireOptions.map((option, index) => ({
                    size: option.size,
                    trim: option.trim,
                    url: option.url,
                    selected: index === 0 // Select first option by default
                }));

                console.log('Multiple tire options found, navigating to vehicle-lookup-trims with data:', {
                    vehicleInfo,
                    tireSizes
                });

                // Navigate with state
                history.push('/vehicle-lookup-trims', {
                    vehicleInfo,
                    tireSizes
                });
            }

        } catch (err) {
            console.error('Error submitting Vehicle Lookup:', err);
        }
    };

    /**
     * Handle VIN Lookup form submission
     * @param {Object} values - Form values
     */
    const handleVinSubmit = async (values) => {
        const vin = values.vin?.trim();

        // Reset previous errors
        setVinError('');

        // Validate VIN number
        if (!vin) {
            setVinError('VIN number is required');
            return;
        }

        if (!validateVin(vin)) {
            setVinError('Invalid VIN number. VIN must be 17 characters, alphanumeric, and cannot contain I, O, or Q.');
            return;
        }

        console.log('VIN Lookup Form Data:', values);

        try {
            // Send GraphQL request
            await getOptionsByVin(vin);
        } catch (err) {
            console.error('Error submitting VIN Lookup:', err);
            setVinError('Error looking up VIN. Please try again.');
        }
    };

    /**
     * Check if vehicle lookup form is ready for submission
     * @returns {boolean} True if form can be submitted
     */
    const isVehicleFormReady = selectedYear && selectedMake && selectedModel;

    return (
        <section className={classes.quickLookupsSection}>
            <div className={classes.container}>
                <h2 className={classes.sectionTitle}>
                    <FormattedMessage
                        id="quickLookups.title"
                        defaultMessage="Quick Lookups"
                    />
                </h2>

                <div className={classes.formsContainer}>
                    {/* Vehicle Lookup Form */}
                    <div className={classes.formCard}>
                        <h3 className={classes.formTitle}>
                            <FormattedMessage
                                id="quickLookups.vehicleLookup"
                                defaultMessage="Vehicle Lookup"
                            />
                        </h3>

                        <Form onSubmit={handleVehicleSubmit} className={classes.form}>
                            <div className={classes.fieldGroup}>
                                <Field label="Year" id="year">
                                    <YearSelect
                                        field="year"
                                        placeholder="Select year"
                                        required
                                        onChange={handleYearChange}
                                    />
                                </Field>
                            </div>

                            <div className={classes.fieldGroup}>
                                <Field label="Make" id="make">
                                    <MakeSelect
                                        field="make"
                                        placeholder="Select make"
                                        required
                                        year={selectedYear}
                                        onChange={handleMakeChange}
                                    />
                                </Field>
                            </div>

                            <div className={classes.fieldGroup}>
                                <Field label="Model" id="model">
                                    <ModelSelect
                                        field="model"
                                        placeholder="Select model"
                                        required
                                        year={selectedYear}
                                        make={selectedMake}
                                        onChange={handleModelChange}
                                    />
                                </Field>
                            </div>



                            <Button
                                type="submit"
                                className={classes.submitButton}
                                priority="high"
                                disabled={!isVehicleFormReady || optionsLoading}
                            >
                                {optionsLoading ? (
                                    <FormattedMessage
                                        id="quickLookups.loading"
                                        defaultMessage="LOADING..."
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="quickLookups.lookupVehicle"
                                        defaultMessage="LOOKUP VEHICLE"
                                    />
                                )}
                            </Button>

                            {optionsError && (
                                <div className={classes.errorMessage}>
                                    <FormattedMessage
                                        id="quickLookups.optionsError"
                                        defaultMessage="Error loading vehicle options. Please try again."
                                    />
                                </div>
                            )}
                        </Form>
                    </div>

                    {/* VIN Lookup Form */}
                    <div className={classes.formCard}>
                        <h3 className={classes.formTitle}>
                            <FormattedMessage
                                id="quickLookups.vinLookup"
                                defaultMessage="VIN Lookup"
                            />
                        </h3>

                        <Form onSubmit={handleVinSubmit} className={classes.form}>
                            <div className={classes.fieldGroup}>
                                <Field label="Enter VIN" id="vin">
                                    <TextInput
                                        field="vin"
                                        placeholder="Enter 17-character VIN"
                                        required
                                        maxLength={17}
                                        style={{ textTransform: 'uppercase' }}
                                    />
                                </Field>
                            </div>

                            <p className={classes.hintText}>
                                <FormattedMessage
                                    id="quickLookups.vinHint"
                                    defaultMessage="VIN: 17 characters, no I, O, or Q"
                                />
                            </p>

                            {vinError && (
                                <div className={classes.errorMessage}>
                                    {vinError}
                                </div>
                            )}

                            {vinQueryError && (
                                <div className={classes.errorMessage}>
                                    <FormattedMessage
                                        id="quickLookups.vinQueryError"
                                        defaultMessage="Error looking up VIN. Please try again."
                                    />
                                </div>
                            )}

                            <Button
                                type="submit"
                                className={classes.submitButton}
                                priority="high"
                                disabled={vinLoading}
                            >
                                {vinLoading ? (
                                    <FormattedMessage
                                        id="quickLookups.loading"
                                        defaultMessage="LOADING..."
                                    />
                                ) : (
                                    <FormattedMessage
                                        id="quickLookups.lookupVin"
                                        defaultMessage="LOOKUP VIN"
                                    />
                                )}
                            </Button>
                        </Form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default QuickLookups;
