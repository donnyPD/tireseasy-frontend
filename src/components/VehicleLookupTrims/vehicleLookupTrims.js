import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Link } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import defaultClasses from './vehicleLookupTrims.module.css';

/**
 * VehicleLookupTrims component for displaying tire size options
 * @param {Object} props - Component props
 * @param {Object} props.classes - CSS classes
 * @param {Object} props.vehicleInfo - Vehicle information object
 * @param {string} props.vehicleInfo.year - Vehicle year
 * @param {string} props.vehicleInfo.make - Vehicle make
 * @param {string} props.vehicleInfo.model - Vehicle model
 * @param {string} props.vehicleInfo.vin - VIN number (for VIN lookup)
 * @param {Array} props.tireSizes - Array of available tire sizes
 * @param {boolean} props.isVinLookup - Flag indicating if this is from VIN lookup
 * @param {Function} props.onTireSizeSelect - Callback for tire size selection
 * @returns {JSX.Element} VehicleLookupTrims component
 */
const VehicleLookupTrims = props => {
    const {
        vehicleInfo = { year: '2023', make: 'Chevrolet', model: 'Silverado 1500' },
        tireSizes = [
            { size: '275/60R20', selected: false },
            { size: '265/65R18', selected: true },
            { size: '255/70R17', selected: false },
            { size: '285/45R22', selected: false },
            { size: '245/75R16', selected: false }
        ],
        isVinLookup = false,
        onTireSizeSelect = () => {}
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const [selectedTireSize, setSelectedTireSize] = useState(
        tireSizes.find(tire => tire.selected)?.size || ''
    );

    /**
     * Handle tire size selection
     * @param {string} size - Selected tire size
     */
    const handleTireSizeSelect = (size) => {
        setSelectedTireSize(size);
        onTireSizeSelect(size);
    };

    // Note: handleViewTires function removed as tire size buttons are now direct links

    return (
        <div className={classes.container}>
            {/* Header */}
            <header className={classes.header}>
                <h1 className={classes.title}>
                    <FormattedMessage
                        id="vehicleLookupTrims.title"
                        defaultMessage="Vehicle Lookup"
                    />
                </h1>
            </header>

            {/* Vehicle Information */}
            <section className={classes.vehicleSection}>
                <div className={classes.vehicleInfo}>
                    {isVinLookup ? (
                        <>
                            <h2 className={classes.vehicleTitle}>
                                <FormattedMessage
                                    id="vehicleLookupTrims.vinTitle"
                                    defaultMessage="VIN Lookup Results"
                                />
                            </h2>
                            <p className={classes.vinNumber}>
                                <strong>VIN: </strong>{vehicleInfo.vin}
                            </p>
                            <p className={classes.vehicleDescription}>
                                <FormattedMessage
                                    id="vehicleLookupTrims.vinDescription"
                                    defaultMessage="Please select the tire size that matches your vehicle's specifications to view compatible tires."
                                />
                            </p>
                        </>
                    ) : (
                        <>
                            <h2 className={classes.vehicleTitle}>
                                {`${vehicleInfo.year} ${vehicleInfo.make} ${vehicleInfo.model}`}
                            </h2>
                            <p className={classes.vehicleDescription}>
                                <FormattedMessage
                                    id="vehicleLookupTrims.description"
                                    defaultMessage="Please select the OE (Original Equipment) tire size that matches your vehicle's specifications to view compatible tires."
                                />
                            </p>
                        </>
                    )}
                </div>
            </section>

            {/* Tire Size Options */}
            <section className={classes.tireSizeSection}>
                <h3 className={classes.sectionTitle}>
                    <FormattedMessage
                        id="vehicleLookupTrims.tireSizeOptions"
                        defaultMessage="OE Tire Size Options"
                    />
                </h3>

                <div className={classes.tireSizeGrid}>
                    {tireSizes.map((tire, index) => (
                        tire.url ? (
                            <Link
                                key={index}
                                to={tire.url}
                                className={`${classes.tireSizeButton} ${classes.tireSizeLink}`}
                                onClick={() => handleTireSizeSelect(tire.size)}
                            >
                                <div className={classes.tireSizeContent}>
                                    <div className={classes.tireSize}>{tire.size}</div>
                                    {tire.trim && (
                                        <div className={classes.tireTrim}>{tire.trim}</div>
                                    )}
                                </div>
                            </Link>
                        ) : (
                            <button
                                key={index}
                                className={`${classes.tireSizeButton} ${
                                    selectedTireSize === tire.size ? classes.selected : ''
                                }`}
                                onClick={() => handleTireSizeSelect(tire.size)}
                                type="button"
                            >
                                <div className={classes.tireSizeContent}>
                                    <div className={classes.tireSize}>{tire.size}</div>
                                    {tire.trim && (
                                        <div className={classes.tireTrim}>{tire.trim}</div>
                                    )}
                                </div>
                            </button>
                        )
                    ))}
                </div>
            </section>

            {/* Information Section */}
            <section className={classes.infoSection}>
                <p className={classes.infoText}>
                    <FormattedMessage
                        id="vehicleLookupTrims.infoText"
                        defaultMessage="Click on any tire size option above to view available tires for that specification."
                    />
                </p>
            </section>
        </div>
    );
};

export default VehicleLookupTrims;
