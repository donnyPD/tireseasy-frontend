import React, { useEffect, useState } from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useLocation } from 'react-router-dom';
import VehicleLookupTrims from './vehicleLookupTrims';
import QuickLookups from '../QuickLookups';
import defaultClasses from './vehicleLookupTrimsPage.module.css';

/**
 * VehicleLookupTrimsPage - page with sidebar layout containing QuickLookups and main content with VehicleLookupTrims
 * Uses the same layout pattern as the home page with QuickLookups in a sticky aside sidebar
 * @param {Object} props - Component props
 * @param {Object} props.classes - CSS classes
 * @returns {JSX.Element} VehicleLookupTrimsPage component
 */
const VehicleLookupTrimsPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();
    const [lookupData, setLookupData] = useState({
        vehicleInfo: null,
        tireSizes: [],
        isVinLookup: false
    });

    useEffect(() => {
        // First try to get data from navigation state (backward compatibility)
        const navigationData = location.state || {};
        
        // Then try to get data from session storage
        const sessionData = sessionStorage.getItem('vehicleLookupData');
        let parsedSessionData = {};
        
        if (sessionData) {
            try {
                parsedSessionData = JSON.parse(sessionData);
                // Clear session data after use
                sessionStorage.removeItem('vehicleLookupData');
            } catch (error) {
                console.error('Error parsing session data:', error);
            }
        }

        // Merge data with priority to session storage
        const vehicleInfo = parsedSessionData.vehicleInfo || navigationData.vehicleInfo;
        const tireSizes = parsedSessionData.tireSizes || navigationData.tireSizes || [];
        const isVinLookup = parsedSessionData.isVinLookup || navigationData.isVinLookup || false;

        setLookupData({
            vehicleInfo,
            tireSizes,
            isVinLookup
        });

        // If no vehicle info is provided, redirect back to home page
        if (!vehicleInfo) {
            console.warn('No vehicle information provided to VehicleLookupTrimsPage');
            // You might want to redirect to home page or show an error message
        }
    }, [location]);

    const { vehicleInfo, tireSizes, isVinLookup } = lookupData;

    const handleTireSizeSelect = (size) => {
        console.log('Selected tire size:', size);
        // Here you can add logic for handling tire size selection
        // For example, saving to state, sending request to server, etc.
    };

    return (
        <div className={classes.layoutContainer}>
            {/* Sidebar with QuickLookups */}
            <aside className={classes.sidebar}>
                <QuickLookups />
            </aside>
            
            {/* Main content area with Vehicle Lookup Trims */}
            <main className={classes.mainContent}>
                <VehicleLookupTrims
                    vehicleInfo={vehicleInfo}
                    tireSizes={tireSizes}
                    isVinLookup={isVinLookup}
                    onTireSizeSelect={handleTireSizeSelect}
                />
            </main>
        </div>
    );
};

export default VehicleLookupTrimsPage;
