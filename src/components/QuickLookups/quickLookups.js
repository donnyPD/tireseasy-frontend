import React, { useState, useCallback } from 'react';
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
import TrimsSelect from './TrimsSelect';
import { useOptions } from './useOptions';
import { useVinLookup, validateVin } from './useVinLookup';
import defaultClasses from './quickLookups.module.css';

/**
 * QuickLookups component with Vehicle Lookup and VIN Lookup forms
 * @param {Object} props - Component props
 * @param {Object} props.classes - CSS classes
 * @param {string} props.initialVin - Initial VIN value to populate in the form
 * @returns {JSX.Element} QuickLookups component
 */
const QuickLookups = props => {
    const { initialVin } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const history = useHistory();
    const [selectedYear, setSelectedYear] = useState('');
    const [selectedMake, setSelectedMake] = useState('');
    const [selectedModel, setSelectedModel] = useState('');
    const [selectedTrim, setSelectedTrim] = useState('');
    const [availableTrims, setAvailableTrims] = useState([]);
    const [vinChange, setVinChange] = useState('');
    const [vinError, setVinError] = useState('');
    const { getOptions, data: optionsData, loading: optionsLoading, error: optionsError, options } = useOptions();
    const { getOptionsByVin, loading: vinLoading, error: vinQueryError } = useVinLookup();

    /**
     * Handle year selection change
     * @param {Event} event - Change event
     */
    const handleYearChange = (event) => {
        setSelectedYear(event.target.value);
        // Reset make, model and trim selection when year changes
        setSelectedMake('');
        setSelectedModel('');
        setSelectedTrim('');
        setAvailableTrims([]);
    };

    /**
     * Handle make selection change
     * @param {Event} event - Change event
     */
    const handleMakeChange = (event) => {
        setSelectedMake(event.target.value);
        // Reset model and trim selection when make changes
        setSelectedModel('');
        setSelectedTrim('');
        setAvailableTrims([]);
    };

    /**
     * Handle model selection change
     * @param {Event} event - Change event
     */
    const handleModelChange = (event) => {
        setSelectedModel(event.target.value);
        // Reset trim selection when model changes
        setSelectedTrim('');
        setAvailableTrims([]);
    };

    /**
     * Handle VIN selection change
     * @param {Event} event - Change event
     */
    const handleVinChange = (event) => {
        setVinChange(event.target.value);
    };

    /**
     * Handle trim selection change
     * @param {Event} event - Change event
     */
    const handleTrimChange = useCallback((event) => {
        setSelectedTrim(event.target.value);
    }, []);

    /**
     * Handle trims loaded callback
     * @param {Array} trims - Array of available trims
     */
    const handleTrimsLoaded = useCallback((trims) => {
        setAvailableTrims(trims);
        // If only one trim available, select it automatically
        if (trims.length === 1) {
            setSelectedTrim(trims[0]);
        } else {
            setSelectedTrim('');
        }
    }, []);

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
            // Get options using selected year, make, model and optionally trim
            const result = await getOptions(selectedYear, selectedMake, selectedModel, selectedTrim || null);

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
                    model: selectedModel,
                    trim: selectedTrim
                };

                // Convert tire options to the format expected by VehicleLookupTrims
                const tireSizes = tireOptions.map((option, index) => ({
                    size: option.size,
                    trim: option.trim,
                    url: option.url,
                    column: option.column,
                    size_both: option.size_both.Front ? option.size_both : null,
                    selected: index === 0 // Select first option by default
                }));

                console.log('Multiple tire options found, navigating to vehicle-lookup-trims with data:', {
                    vehicleInfo,
                    tireSizes
                });

                // Navigate with state using URL parameters and session storage
                // Store data in session storage to avoid routing issues
                sessionStorage.setItem('vehicleLookupData', JSON.stringify({
                    vehicleInfo,
                    tireSizes
                }));

                // Navigate to home page with query parameter to show vehicle lookup results
                history.push('/?showVehicleLookupTrims=true');
            }

        } catch (err) {
            console.error('Error submitting Vehicle Lookup:', err);
        }
    };

    /**
     * Handle VIN Lookup form submission
     * Behavior based on number of results:
     * - 0 results: Show "No results" error message
     * - 1 result: Navigate directly to tire listing URL
     * - Multiple results: Navigate to vehicle-lookup-trims page
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
            const result = await getOptionsByVin(vin);

            // Check if we have tire size options
            const vinOptions = result?.data?.getOptionsByVin?.items || [];
            const modelName = result?.data?.getOptionsByVin?.model_name || null;

            if (vinOptions.length === 0) {
                // No results found
                setVinError('No tire options found for this VIN. Please try again or use Vehicle Lookup.');

            } else if (vinOptions.length === 1) {
                // Single result: navigate directly to the tire listing page
                const singleOption = vinOptions[0];
                console.log('Single VIN option found, navigating directly to:', singleOption.url);
                console.log('Single VIN option details:', singleOption);

                // Navigate directly to the tire listing page
                history.push(singleOption.url);

            } else {
                // Multiple results: navigate to vehicle-lookup-trims page with VIN options
                console.log('Multiple VIN options found, navigating to vehicle-lookup-trims with data:', vinOptions);

                // Convert VIN options to the format expected by VehicleLookupTrims
                const tireSizes = vinOptions.map((option, index) => ({
                    size: option.size,
                    trim: option.trim,
                    url: option.url,
                    column: option.column,
                    size_both: option.size_both.Front ? option.size_both : null,
                    selected: index === 0 // Select first option by default
                }));

                // Create vehicle info from VIN (we don't have specific vehicle details from VIN lookup)
                const vehicleInfo = {
                    vin: vin,
                    // We could extract some info from VIN or leave these empty
                    year: '',
                    make: '',
                    model: ''
                };

                // Navigate with state using URL parameters and session storage
                // Store data in session storage to avoid routing issues
                sessionStorage.setItem('vehicleLookupData', JSON.stringify({
                    vehicleInfo,
                    tireSizes,
                    isVinLookup: true, // Flag to indicate this came from VIN lookup
                    modelName
                }));

                // Navigate to home page with query parameter to show vehicle lookup results
                history.push('/?showVehicleLookupTrims=true');
            }

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
    const isVinFormReady = vinChange && vinChange.length > 16;

    return (
        <section className={classes.quickLookupsSection}>
            <div className={classes.container}>
                {/*<h2 className={classes.sectionTitle}>*/}
                {/*    <FormattedMessage*/}
                {/*        id="quickLookups.title"*/}
                {/*        defaultMessage="Quick Lookups"*/}
                {/*    />*/}
                {/*</h2>*/}
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

                            <div className={classes.fieldGroup}>
                                <Field label="Trim (Optional)" id="trim">
                                    <TrimsSelect
                                        field="trim"
                                        placeholder="Select trim"
                                        required={false}
                                        year={selectedYear}
                                        make={selectedMake}
                                        model={selectedModel}
                                        onChange={handleTrimChange}
                                        onTrimsLoaded={handleTrimsLoaded}
                                        value={selectedTrim}
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

                        <Form
                            onSubmit={handleVinSubmit}
                            className={classes.form}
                            initialValues={{ vin: initialVin || '' }}
                        >
                            <div className={classes.fieldGroup}>
                                <Field label="Enter VIN" id="vin">
                                    <TextInput
                                        field="vin"
                                        placeholder="Enter 17-character VIN"
                                        required
                                        maxLength={17}
                                        style={{ textTransform: 'uppercase' }}
                                        onChange={handleVinChange}
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
                                disabled={!isVinFormReady || vinLoading}
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
