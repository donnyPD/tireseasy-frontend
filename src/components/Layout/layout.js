import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import QuickLookups from '../QuickLookups';
import defaultClasses from './layout.module.css';

/**
 * Layout component with sidebar for QuickLookups and main content area
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Main content to display
 * @param {Object} props.classes - CSS classes
 * @param {string} props.initialVin - Initial VIN value to populate in QuickLookups form
 * @returns {JSX.Element} Layout component
 */
const Layout = props => {
    const { children, initialVin } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.layoutContainer}>
            {/* Sidebar with QuickLookups */}
            <aside className={classes.sidebar}>
                <QuickLookups initialVin={initialVin} />
            </aside>
            
            {/* Main content area */}
            <main className={classes.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
