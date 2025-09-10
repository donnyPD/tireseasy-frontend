import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useLocation, useHistory } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import VehicleLookupTrims from '../VehicleLookupTrims/vehicleLookupTrims';
import { useVinLookup, validateVin } from '../QuickLookups/useVinLookup';
import defaultClasses from './homePage.module.css';

// Simple SVG icons for the features
const FastShippingIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="var(--color-accent-success, #28A745)"/>
        <path d="M8 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const LowCostIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="var(--color-accent-orange, #FF8C00)"/>
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round"/>
    </svg>
);

const SupportIcon = () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="var(--color-primary-deep, #1A2C5B)"/>
        <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const HomePage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();
    const history = useHistory();
    const { getOptionsByVin } = useVinLookup();
    const [showVehicleLookupTrims, setShowVehicleLookupTrims] = useState(false);
    const [lookupData, setLookupData] = useState({
        vehicleInfo: null,
        tireSizes: [],
        isVinLookup: false
    });
    const [vinProcessing, setVinProcessing] = useState(false);

    /**
     * Handle automatic VIN lookup from URL parameter
     * @param {string} vin - VIN number from URL parameter
     */
    const handleAutoVinLookup = async (vin) => {
        if (!validateVin(vin)) {
            console.error('Invalid VIN number from URL:', vin);
            return;
        }

        console.log('Auto VIN Lookup triggered with VIN:', vin);
        setVinProcessing(true);

        try {
            // Execute VIN lookup
            const result = await getOptionsByVin(vin);
            const vinOptions = result?.data?.getOptionsByVin?.items || [];

            if (vinOptions.length === 0) {
                // No results found - just log, don't show error to user for auto-lookup
                console.warn('No tire options found for VIN from URL:', vin);
                
            } else if (vinOptions.length === 1) {
                // Single result: navigate directly to the tire listing page
                const singleOption = vinOptions[0];
                console.log('Single VIN option found from URL, navigating directly to:', singleOption.url);
                history.push(singleOption.url);
                return;

            } else {
                // Multiple results: show VehicleLookupTrims with VIN options
                console.log('Multiple VIN options found from URL, showing vehicle-lookup-trims');

                // Convert VIN options to the format expected by VehicleLookupTrims
                const tireSizes = vinOptions.map((option, index) => ({
                    size: option.size,
                    trim: option.trim,
                    url: option.url,
                    selected: index === 0 // Select first option by default
                }));

                // Create vehicle info from VIN
                const vehicleInfo = {
                    vin: vin,
                    year: '',
                    make: '',
                    model: ''
                };

                // Set lookup data and show VehicleLookupTrims
                setLookupData({
                    vehicleInfo,
                    tireSizes,
                    isVinLookup: true
                });
                setShowVehicleLookupTrims(true);
            }

        } catch (error) {
            console.error('Error in auto VIN lookup:', error);
        } finally {
            setVinProcessing(false);
        }
    };

    useEffect(() => {
        // Check URL parameters
        const urlParams = new URLSearchParams(location.search);
        const shouldShowTrims = urlParams.get('showVehicleLookupTrims') === 'true';
        const vinParam = urlParams.get('vin');
        
        // Handle VIN parameter first (if present and showVehicleLookupTrims is true)
        if (shouldShowTrims && vinParam) {
            handleAutoVinLookup(vinParam);
            return;
        }
        
        // Handle regular showVehicleLookupTrims logic
        if (shouldShowTrims) {
            // Get data from session storage
            const sessionData = sessionStorage.getItem('vehicleLookupData');
            
            if (sessionData) {
                try {
                    const parsedData = JSON.parse(sessionData);
                    setLookupData(parsedData);
                    setShowVehicleLookupTrims(true);
                    // Clear session data after use
                    sessionStorage.removeItem('vehicleLookupData');
                } catch (error) {
                    console.error('Error parsing session data:', error);
                }
            }
        }
    }, [location]);

    // Get VIN parameter for QuickLookups form auto-fill (when not doing auto-lookup)
    const urlParams = new URLSearchParams(location.search);
    const vinParam = urlParams.get('vin');
    const shouldShowTrims = urlParams.get('showVehicleLookupTrims') === 'true';
    const initialVin = (!shouldShowTrims && vinParam) ? vinParam : undefined;

    // Show loading indicator while processing VIN from URL
    if (vinProcessing) {
        return (
            <>
                <StoreTitle>Processing VIN Lookup...</StoreTitle>
                <Layout>
                    <div className={classes.loadingContainer}>
                        <div className={classes.loadingSpinner}>
                            <FormattedMessage
                                id="homePage.vinProcessing"
                                defaultMessage="Processing VIN lookup, please wait..."
                            />
                        </div>
                    </div>
                </Layout>
            </>
        );
    }

    // If we should show VehicleLookupTrims, render it instead of the regular home page
    if (showVehicleLookupTrims && lookupData.vehicleInfo) {
        return (
            <>
                <StoreTitle>Vehicle Lookup Results</StoreTitle>
                <Layout>
                    <VehicleLookupTrims
                        vehicleInfo={lookupData.vehicleInfo}
                        tireSizes={lookupData.tireSizes}
                        isVinLookup={lookupData.isVinLookup}
                        onTireSizeSelect={(size) => {
                            console.log('Selected tire size:', size);
                        }}
                    />
                </Layout>
            </>
        );
    }

    return (
        <>
            <StoreTitle>Your Ultimate Source for Automotive Parts</StoreTitle>

            <Layout initialVin={initialVin}>
                {/* Hero Section */}
                <section className={classes.heroSection}>
                    <div className={classes.container}>
                        <h1 className={classes.heroTitle}>
                            <FormattedMessage
                                id="homePage.heroTitle"
                                defaultMessage="Your Ultimate Source for Automotive Parts"
                            />
                        </h1>
                        <p className={classes.heroDescription}>
                            <FormattedMessage
                                id="homePage.heroDescription"
                                defaultMessage="Discover a vast selection of high-quality tires, wheels, auto parts, and more. DriveLine offers competitive pricing, fast shipping, and unparalleled customer support."
                            />
                        </p>
                        <div className={classes.heroButtons}>
                            <Button
                                className={classes.heroButton}
                                priority="high"
                                type="button"
                            >
                                <FormattedMessage
                                    id="homePage.heroButton"
                                    defaultMessage="Get Started Today"
                                />
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={classes.featuresSection}>
                    <div className={classes.container}>
                        <h2 className={classes.featuresTitle}>
                            <FormattedMessage
                                id="homePage.featuresTitle"
                                defaultMessage="Why Choose DriveLine?"
                            />
                        </h2>
                        <div className={classes.featuresGrid}>
                            <div className={classes.featureCard}>
                                <div className={classes.featureIcon}>
                                    <FastShippingIcon />
                                </div>
                                <h3 className={classes.featureTitle}>
                                    <FormattedMessage
                                        id="homePage.fastShipping"
                                        defaultMessage="Fast Shipping"
                                    />
                                </h3>
                                <p className={classes.featureDescription}>
                                    <FormattedMessage
                                        id="homePage.fastShippingDesc"
                                        defaultMessage="Get your parts quickly with our expedited shipping options. We ensure timely delivery to keep you on the road."
                                    />
                                </p>
                            </div>

                            <div className={classes.featureCard}>
                                <div className={classes.featureIcon}>
                                    <LowCostIcon />
                                </div>
                                <h3 className={classes.featureTitle}>
                                    <FormattedMessage
                                        id="homePage.lowCost"
                                        defaultMessage="Low Cost Solutions"
                                    />
                                </h3>
                                <p className={classes.featureDescription}>
                                    <FormattedMessage
                                        id="homePage.lowCostDesc"
                                        defaultMessage="We offer competitive pricing without compromising on quality, ensuring you get the best value."
                                    />
                                </p>
                            </div>

                            <div className={classes.featureCard}>
                                <div className={classes.featureIcon}>
                                    <SupportIcon />
                                </div>
                                <h3 className={classes.featureTitle}>
                                    <FormattedMessage
                                        id="homePage.dedicatedSupport"
                                        defaultMessage="Dedicated Support"
                                    />
                                </h3>
                                <p className={classes.featureDescription}>
                                    <FormattedMessage
                                        id="homePage.dedicatedSupportDesc"
                                        defaultMessage="Our expert team is ready to assist you with any questions or concerns, ensuring a smooth experience."
                                    />
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={classes.ctaSection}>
                    <div className={classes.container}>
                        <h2 className={classes.ctaTitle}>
                            <FormattedMessage
                                id="homePage.ctaTitle"
                                defaultMessage="Explore Our Extensive Catalog"
                            />
                        </h2>
                        <p className={classes.ctaDescription}>
                            <FormattedMessage
                                id="homePage.ctaDescription"
                                defaultMessage="Browse top brands and find the perfect parts for your vehicle. Quality and reliability guaranteed."
                            />
                        </p>
                        <Button
                            className={classes.ctaButton}
                            priority="high"
                            type="button"
                        >
                            <FormattedMessage
                                id="homePage.ctaButton"
                                defaultMessage="View Our Brands"
                            />
                        </Button>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default HomePage;
