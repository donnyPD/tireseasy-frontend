import React, { useEffect, useState, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { useLocation, useHistory } from 'react-router-dom';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Button from '@magento/venia-ui/lib/components/Button';
import { Link } from 'react-router-dom';
import Layout from '../Layout';
import VehicleLookupTrims from '../VehicleLookupTrims/vehicleLookupTrims';
import OrderHistorySection from '../OrderHistoryPage/orderHistorySection';
import { useVinLookup, validateVin } from '../QuickLookups/useVinLookup';
import defaultClasses from './homePage.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql';
import { useApolloClient, useMutation } from '@apollo/client';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

const CmsBlock = React.lazy(() => import('@magento/venia-ui/lib/components/CmsBlock'));

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
    const [{ isSignedIn }, { setToken, getUserDetails }] = useUserContext();
    const [showVehicleLookupTrims, setShowVehicleLookupTrims] = useState(false);
    const [lookupData, setLookupData] = useState({
        vehicleInfo: null,
        tireSizes: [],
        isVinLookup: false
    });
    const [vinProcessing, setVinProcessing] = useState(false);
    const [authProcessing, setAuthProcessing] = useState(false);
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { createCartMutation } = operations;
    const [fetchCartId] = useMutation(createCartMutation);
    const cartContext = useCartContext();
    const [{ cartId }, { createCart, removeCart }] = cartContext;
    const apolloClient = useApolloClient();

    /**
     * Handle JWT token authentication from URL parameter
     * @param {string} token - JWT token from URL parameter
     * @returns {Promise<boolean>} Returns true if authentication was successful
     */
    const handleJwtAuth = async (token) => {
        if (!token || typeof token !== 'string') {
            console.error('Invalid JWT token from URL:', token);
            return false;
        }

        console.log('JWT Authentication triggered with token:', token);
        setAuthProcessing(true);

        try {
            // Validate JWT token format (basic check)
            const tokenParts = token.split('.');
            if (tokenParts.length !== 3) {
                console.error('Invalid JWT token format');
                return false;
            }

            // Set the token using PWA Studio's authentication system
            await setToken(token);

            // Clear all cart/customer data from cache and redux.
            await apolloClient.clearCacheData(apolloClient, 'cart');
            await removeCart();

            // Create and get the customer's cart id.
            await createCart({
                fetchCartId
            });

            // Fetch user details after setting the token
            if (getUserDetails) {
                await getUserDetails();
            }

            console.log('JWT authentication successful');
            return true;

        } catch (error) {
            console.error('Error in JWT authentication:', error);
            return false;
        } finally {
            setAuthProcessing(false);
        }
    };

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
                    column: option.column,
                    size_both: option.size_both.Front ? option.size_both : null,
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
        const shouldShowTrims = urlParams.get('showVehicleLookupTrims') === '1' || urlParams.get('showVehicleLookupTrims') === 'true';
        const vinParam = urlParams.get('vin');
        const tokenParam = urlParams.get('token');
        const punchoutParam = urlParams.get('punchout') === '1' || urlParams.get('newlocation') === '1';

        // Handle JWT authentication first if token and punchout parameters are present
        if (tokenParam && punchoutParam) {
            if (urlParams.get('punchout') === '1') {
                localStorage.setItem('punchout_customer', '1');
            }
        }
        if (tokenParam && punchoutParam && !isSignedIn) {
            console.log('Punchout mode detected, attempting JWT authentication');
            handleJwtAuth(tokenParam).then(success => {
                if (success) {
                    console.log('JWT authentication successful, user should be signed in');
                    // Continue with VIN lookup if needed
                    if (shouldShowTrims && vinParam) {
                        handleAutoVinLookup(vinParam);
                    }
                } else {
                    console.error('JWT authentication failed');
                    // Still continue with VIN lookup if needed (without authentication)
                    if (shouldShowTrims && vinParam) {
                        handleAutoVinLookup(vinParam);
                    }
                }
            });
            return;
        }

        // Handle VIN parameter (if present and showVehicleLookupTrims is true)
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
    }, [location, isSignedIn]);

    // Get VIN parameter for QuickLookups form auto-fill (when not doing auto-lookup)
    const urlParams = new URLSearchParams(location.search);
    const vinParam = urlParams.get('vin');
    const shouldShowTrims = urlParams.get('showVehicleLookupTrims') === '1' || urlParams.get('showVehicleLookupTrims') === 'true';
    const initialVin = (!shouldShowTrims && vinParam) ? vinParam : undefined;

    // Show loading indicator while processing authentication or VIN from URL
    if (authProcessing) {
        return (
            <>
                <StoreTitle>Authenticating...</StoreTitle>
                <Layout>
                    <div className={classes.loadingContainer}>
                        <div className={classes.loadingSpinner}>
                            <FormattedMessage
                                id="homePage.authProcessing"
                                defaultMessage="Authenticating user, please wait..."
                            />
                        </div>
                    </div>
                </Layout>
            </>
        );
    }

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
                        <div className={classes.section}>
                            <OrderHistorySection isHomepage={true} />
                            <Suspense fallback={<div className="cms-block-loading" />}>
                                <CmsBlock identifiers={'home_hero_section'}/>
                            </Suspense>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className={classes.featuresSection}>
                    <div className={classes.container}>
                        <div className={classes.section}>
                            <Suspense fallback={<div className="cms-block-loading" />}>
                                <CmsBlock identifiers={'why_choose_driveLine'}/>
                            </Suspense>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className={classes.ctaSection}>
                    <div className={classes.container}>
                        <div className={classes.section}>
                            <Suspense fallback={<div className="cms-block-loading" />}>
                                <CmsBlock identifiers={'explore_our_extensive_catalog_block'}/>
                            </Suspense>
                        </div>
                    </div>
                </section>
            </Layout>
        </>
    );
};

export default HomePage;
