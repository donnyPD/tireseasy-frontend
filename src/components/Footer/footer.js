import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { useCustomFooter } from './useCustomFooter';

const Footer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { 
        categories, 
        categoriesLoading,
        companyInfo,
        quickLinks 
    } = useCustomFooter();

    return (
        <footer className={classes.root}>
            <div className={classes.container}>
                <div className={classes.sections}>
                    {/* Company Info Section */}
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            <FormattedMessage 
                                id="footer.companyInfo"
                                defaultMessage="Company Info"
                            />
                        </h3>
                        <p className={classes.description}>
                            {companyInfo.description}
                        </p>
                    </div>

                    {/* Quick Links Section */}
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            <FormattedMessage 
                                id="footer.quickLinks"
                                defaultMessage="Quick Links"
                            />
                        </h3>
                        <ul className={classes.linksList}>
                            {!categoriesLoading && categories.map(category => (
                                <li key={category.uid || category.id} className={classes.linkItem}>
                                    <Link to={category.path} className={classes.link}>
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                            <li className={classes.linkItem}>
                                <Link to="/customer/account" className={classes.link}>
                                    <FormattedMessage 
                                        id="footer.accountSettings"
                                        defaultMessage="Account Settings"
                                    />
                                </Link>
                            </li>
                            <li className={classes.linkItem}>
                                <Link to="/sales/order/history" className={classes.link}>
                                    <FormattedMessage 
                                        id="footer.orderHistory"
                                        defaultMessage="Order History"
                                    />
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Us Section */}
                    <div className={classes.section}>
                        <h3 className={classes.sectionTitle}>
                            <FormattedMessage 
                                id="footer.contactUs"
                                defaultMessage="Contact Us"
                            />
                        </h3>
                        <div className={classes.contactInfo}>
                            <p className={classes.contactItem}>
                                <span className={classes.contactLabel}>
                                    <FormattedMessage 
                                        id="footer.email"
                                        defaultMessage="Email:"
                                    />
                                </span>
                                <a href={`mailto:${companyInfo.email}`} className={classes.contactLink}>
                                    {companyInfo.email}
                                </a>
                            </p>
                            <p className={classes.contactItem}>
                                <span className={classes.contactLabel}>
                                    <FormattedMessage 
                                        id="footer.phone"
                                        defaultMessage="Phone:"
                                    />
                                </span>
                                <a href={`tel:${companyInfo.phone}`} className={classes.contactLink}>
                                    {companyInfo.phone}
                                </a>
                            </p>
                            <p className={classes.contactItem}>
                                <span className={classes.contactLabel}>
                                    <FormattedMessage 
                                        id="footer.address"
                                        defaultMessage="Address:"
                                    />
                                </span>
                                <span className={classes.address}>
                                    {companyInfo.address}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className={classes.copyright}>
                    <p>
                        © 2025 DriveLine. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

Footer.propTypes = {
    classes: shape({
        root: string
    })
};
// Force recompilation
// Fixed Apollo Client error
