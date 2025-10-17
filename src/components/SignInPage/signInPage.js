import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { useSignInPage } from '@magento/peregrine/lib/talons/SignInPage/useSignInPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import SignIn from '../SignIn';
const KEY = 'M2_VENIA_BROWSER_PERSISTENCE';

import defaultClasses from './signInPage.module.css';

const SignInPage = props => {
    if (localStorage.getItem(KEY + '__cartId')) {
        localStorage.setItem(KEY + '__cartId', '');
    }
    if (localStorage.getItem(KEY + '__magento_cache_id')) {
        localStorage.setItem(KEY + '__magento_cache_id', '');
    }
    const classes = useStyle(defaultClasses, props.classes);
    const { signInProps } = useSignInPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'signInPage.title',
                    defaultMessage: 'Sign In'
                })}
            </StoreTitle>
            <div className={classes.contentContainer}>
                <SignIn {...signInProps} />
            </div>
        </div>
    );
};

SignInPage.defaultProps = {
    createAccountPageUrl: '/create-account',
    forgotPasswordPageUrl: '/forgot-password',
    signedInRedirectUrl: '/'
};

SignInPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    createAccountPageUrl: string,
    forgotPasswordPageUrl: string,
    signedInRedirectUrl: string
};

export default SignInPage;
