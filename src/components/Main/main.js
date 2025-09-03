import React from 'react';
import { bool, shape, string } from 'prop-types';
import { useScrollLock } from '@magento/peregrine';
import { useLocation } from 'react-router-dom';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Footer from '../Footer';
import Header from '../Header';
import HomePage from '../HomePage';
import VehicleLookupTrimsPage from '../VehicleLookupTrims/VehicleLookupTrimsPage';
import defaultClasses from '@magento/venia-ui/lib/components/Main/main.module.css';

const Main = props => {
    const { children, isMasked } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const location = useLocation();

    const rootClass = isMasked ? classes.root_masked : classes.root;
    const pageClass = isMasked ? classes.page_masked : classes.page;

    useScrollLock(isMasked);

    // Check if we're on the home page or vehicle lookup page
    const isHomePage = location.pathname === '/' || location.pathname === '/home';
    const isVehicleLookupPage = location.pathname === '/vehicle-lookup-trims';

    return (
        <main className={rootClass}>
            <Header />
            <div className={pageClass}>
                {isHomePage ? <HomePage /> : 
                 isVehicleLookupPage ? <VehicleLookupTrimsPage /> :
                 children}
            </div>
            <Footer />
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
