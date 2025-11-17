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
        onTireSizeSelect = () => {},
        modelName
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const [selectedTireSize, setSelectedTireSize] = useState(
        tireSizes.find(tire => tire.selected)?.size || ''
    );
    const [selectedTireSizeUrl, setSelectedTireSizeUrl] = useState(
        tireSizes.find(tire => tire.selected)?.size
            ? tireSizes.find(tire => tire.selected)?.url
            : ''
    );
    const vehicleTitle = modelName ? modelName : 'VIN Lookup Results';

    /**
     * Handle tire size selection
     * @param {string} size - Selected tire size
     * @param {string} url - Selected tire size
     */
    const handleTireSizeSelect = (size, url) => {
        setSelectedTireSize(size);
        setSelectedTireSizeUrl(url);
        onTireSizeSelect(size);
    };

    const tireItem = (list) => {
        return list.map((tire, index) => (
            <button
                key={index}
                className={`${classes.tireSizeButton} ${
                    tire.size_both
                        ? selectedTireSize === `${tire.size_both.Front} / ${tire.size_both.Rear}`
                            ? classes.selected
                            : ''
                        : selectedTireSize === tire.size
                            ? classes.selected
                            : ''
                }`}
                onClick={() => handleTireSizeSelect(tire.size_both ? `${tire.size_both.Front} / ${tire.size_both.Rear}` : tire.size, tire.url)}
                type="button"
            >
                <div className={classes.tireSizeContent}>
                    {tire.size && <div className={classes.tireSize}>{tire.size}</div>}
                    {tire.size_both && <div className={classes.tireBoth}>
                        <h4>
                            <FormattedMessage
                                id="size.both.Staggered.title"
                                defaultMessage="Staggered Set (Both)"
                            />
                        </h4>
                        <div>
                            <span>
                                <FormattedMessage
                                    id="size.both.label"
                                    defaultMessage="Front:"
                                />
                            </span>
                            <span>{tire.size_both.Front}</span>
                        </div>
                        <div>
                            <span>
                                <FormattedMessage
                                    id="size.both.label"
                                    defaultMessage="Rear:"
                                />
                            </span>
                            <span>{tire.size_both.Rear}</span>
                        </div>
                    </div>}
                </div>
            </button>)
        )
    }

    // Note: handleViewTires function removed as tire size buttons are now direct links

    return (
        <div>
            {/* Header */}
            <header className={classes.header}>
                <h1 className={classes.title}>
                    <FormattedMessage
                        id="vehicleLookupTrims.title"
                        defaultMessage="Vehicle Lookup"
                    />
                </h1>
            </header>
            <div className={classes.container}>
                {/* Vehicle Information */}
                <section className={classes.vehicleSection}>
                    <div className={classes.vehicleInfo}>
                        {isVinLookup ? (
                            <>
                                <h2 className={classes.vehicleTitle}>
                                    <FormattedMessage
                                        id="vehicleLookupTrims.vinTitle"
                                        defaultMessage={vehicleTitle}
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

                    <div className={classes.tireContainer}>
                        {tireSizes.filter(el => el.column === 'standard').length > 0 && <div>
                            <h3>
                                <FormattedMessage
                                    id="vehicleLookupTrims.tire.Standard"
                                    defaultMessage="Standard Set"
                                />
                            </h3>
                            {tireItem(tireSizes.filter(el => el.column === 'standard'))}
                        </div>}
                        {tireSizes.filter(el => el.column === 'staggered').length > 0 && <div>
                            <h3>
                                <FormattedMessage
                                    id="vehicleLookupTrims.tire.Staggered"
                                    defaultMessage="Staggered Fitment Options"
                                />
                            </h3>
                            {tireItem(tireSizes.filter(el => el.column === 'staggered'))}
                        </div>}
                    </div>
                </section>

                {/* Information Section */}
                <section className={classes.infoSection}>
                    <Link
                        className={classes.selectedTiresBtn}
                        disabled={selectedTireSizeUrl === ''}
                        to={selectedTireSizeUrl}
                        type="button"
                    >
                        <FormattedMessage
                            id="vehicleLookupTrims.button.infoText"
                            defaultMessage="View Tires for Selected Size"
                        />
                    </Link>
                </section>
            </div>
        </div>
    );
};

export default VehicleLookupTrims;
