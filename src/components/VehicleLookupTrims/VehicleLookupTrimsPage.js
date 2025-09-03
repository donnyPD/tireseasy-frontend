import React from 'react';
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

    // Get data from navigation state
    const navigationData = location.state || {};
    const vehicleInfo = navigationData.vehicleInfo;
    const tireSizes = navigationData.tireSizes || [];

    // If no vehicle info is provided, redirect back to home page
    if (!vehicleInfo) {
        console.warn('No vehicle information provided to VehicleLookupTrimsPage');
        // You might want to redirect to home page or show an error message
    }

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
                    onTireSizeSelect={handleTireSizeSelect}
                />
            </main>
        </div>
    );
};

export default VehicleLookupTrimsPage;
