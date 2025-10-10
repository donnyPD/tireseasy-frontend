import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useAccountInformationPage } from '@magento/peregrine/lib/talons/AccountInformationPage/useAccountInformationPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './accountInformationPage.module.css';
import AccountInformationPageOperations from './accountInformationPage.gql.js';
import QuickLookups from "../QuickLookups";

const EditModal = React.lazy(() => import('./editModal'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations
    });

    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode,
        recaptchaWidgetProps
    } = talonProps;
    const { formatMessage } = useIntl();

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id={'accountInformationPage.errorTryAgain'}
                defaultMessage={
                    'Something went wrong. Please refresh and try again.'
                }
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;
        const passwordValue = '***********';

        pageContent = (
            <Fragment>
                {!isUpdateMode && <div className={classes.accountDetails}>
                    <div className={classes.header}>
                        <span
                            className={classes.headerText}
                        >
                            <FormattedMessage
                                id={'accountInformationPage.title.new'}
                                defaultMessage={'Profile Information'}
                            />
                        </span>
                    </div>
                    <div className={classes.lineItemsContainer}>
                        <div>
                            <span className={classes.nameLabel}>
                                <FormattedMessage
                                    id={'global.name'}
                                    defaultMessage={'Name'}
                                />
                            </span>
                                <span className={classes.nameValue}>
                                {customerName}
                            </span>
                        </div>
                        <div>
                            <span className={classes.emailLabel}>
                                <FormattedMessage
                                    id={'global.email'}
                                    defaultMessage={'Email'}
                                />
                            </span>
                                <span className={classes.emailValue}>
                                {customer.email}
                            </span>
                        </div>
                        <div>
                             <span className={classes.passwordLabel}>
                                <FormattedMessage
                                    id={'global.password'}
                                    defaultMessage={'Password'}
                                />
                            </span>
                                <span className={classes.passwordValue}>
                                {passwordValue}
                            </span>
                        </div>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.editInformationButton}
                            disabled={false}
                            onClick={showUpdateMode}
                            priority="normal"
                            data-cy="AccountInformationPage-editInformationButton"
                        >
                            <FormattedMessage
                                id={'global.editButton.new'}
                                defaultMessage={'Edit Profile'}
                            />
                        </Button>
                    </div>
                </div>}
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                        recaptchaWidgetProps={recaptchaWidgetProps}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <div className={classes.root}>
            <div className={classes.sidebar}>
                <QuickLookups />
            </div>
            <div className={classes.content}>
                <StoreTitle>
                    {formatMessage({
                        id: 'accountInformationPage.titleAccount.new',
                        defaultMessage: 'Account Settings'
                    })}
                </StoreTitle>
                <h1
                    aria-live="polite"
                    className={classes.title}
                    data-cy="AccountInformationPage-title"
                >
                    <FormattedMessage
                        id={'accountInformationPage.accountInformation.new'}
                        defaultMessage={'Account Settings'}
                    />
                </h1>
                <div className={classes.account_content}>
                    {errorMessage ? errorMessage : pageContent}
                </div>
            </div>
        </div>
    );
};

export default AccountInformationPage;
