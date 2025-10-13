import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './footer.module.css';
import { useCustomFooter } from './useCustomFooter';
import CmsBlockGroup from '@magento/venia-ui/lib/components/CmsBlock';

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
                        <CmsBlockGroup identifiers={'footer_col_1'}/>
                    </div>

                    {/* Quick Links Section */}
                    <div className={classes.section}>
                        <CmsBlockGroup identifiers={'footer_col_2'}/>
                    </div>

                    {/* Contact Us Section */}
                    <div className={classes.section}>
                        <CmsBlockGroup identifiers={'footer_col_3'}/>
                    </div>
                </div>

                {/* Copyright Section */}
                <div className={classes.copyright}>
                    <CmsBlockGroup identifiers={'footer_copyright_block'}/>
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
