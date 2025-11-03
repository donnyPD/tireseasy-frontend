import React, { Fragment, useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';

import {
    isRequired,
    hasLengthAtLeast,
    validatePassword
} from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import defaultClasses from './manageUsers.module.css';
import { useCreateUser } from './useCreateUser';
import Button from '@magento/venia-ui/lib/components/Button';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import UserRow from './userRow';
import { Portal } from '@magento/venia-ui/lib/components/Portal';
import Dialog from '@magento/venia-ui/lib/components/Dialog';

const ManageUsers = props => {
    const talonProps = useCreateUser({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit
    });
    const { formatMessage } = useIntl();
    const {
        errors,
        handleSubmit,
        isDisabled,
        initialValues,
        minimumPasswordLength,
        userList,
        handleDeleteUser,
        handleEditUser
    } = talonProps;
    const [isOpen, setIsOpen] = useState(false);
    const [isOpenConfirmation, setIsOpenConfirmation] = useState('');
    console.log(userList);
    const classes = useStyle(defaultClasses, props.classes);

    const openModal = () => {
        if (!isOpen) {
            setIsOpen(!isOpen);
        }
    }

    const openConfirmationModal = (email) => {
        if (!isOpenConfirmation) {
            setIsOpenConfirmation(email);
        }
    }

    const closeModal = () => {
        if (isOpen) {
            setIsOpen(!isOpen);
        }
    }

    const closeConfirmationModal = () => {
        if (isOpenConfirmation) {
            setIsOpenConfirmation('');
        }
    }

    const deleteUser = () => {
        if (isOpenConfirmation) {
            handleDeleteUser(isOpenConfirmation)
        }
        closeConfirmationModal();
    }

    useEffect(() => {
        if (!isDisabled && isOpen) {
            closeModal();
        }
    }, [isDisabled]);

    const userRows = useMemo(() => {
        if (!userList) {
            return null;
        }
        return userList.map(user => {
            return <UserRow
                key={user.id}
                user={user}
                handleEditUser={handleEditUser}
                openConfirmationModal={openConfirmationModal}
            />;
        });
    }, [userList]);

    const pageContent = useMemo(() => {
        if (!userList || userList.length < 1) {
            return (<div>
                <FormattedMessage
                    id={'no.users'}
                    defaultMessage={'You have no any User...'}
                />
            </div>);
        } else {
            return (
                <div className={classes.users_content}>
                    <ul
                        className={classes.usersTable}
                        data-cy="OrderHistoryPage-orderHistoryTable"
                    >
                        <li className={classes.th}>
                            <div>
                                <span className={classes.userEmail}>
                                    <FormattedMessage
                                        id={'userEmail.text'}
                                        defaultMessage={'Email'}
                                    />
                                </span>
                            </div>
                            <div>
                                 <span className={classes.userFirstName}>
                                    <FormattedMessage
                                        id={'userFirstName.text'}
                                        defaultMessage={'First Name'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span className={classes.userLastName}>
                                    <FormattedMessage
                                        id={'userLastName.text'}
                                        defaultMessage={'Last Name'}
                                    />
                                </span>
                            </div>
                            <div>
                                <span>
                                    <FormattedMessage
                                        id={'user.Actions.text'}
                                        defaultMessage={'Action'}
                                    />
                                </span>
                            </div>
                            {/*<div />*/}
                        </li>
                        {userRows}
                    </ul>
                </div>
            );
        }
    }, [
        isDisabled,
        userList
    ]);

    const newUserContent = useMemo(() => {
        if (isDisabled) {
            return <LoadingIndicator />;
        } else {
            return (
                <>
                    <FormError errors={Array.from(errors.values())} />
                    <Field
                        id="firstName"
                        label={formatMessage({
                            id: 'createAccount.firstNameText',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            id="firstName"
                            field="customer.firstname"
                            autoComplete="given-name"
                            validate={isRequired}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-firstname"
                            aria-label={formatMessage({
                                id: 'global.firstNameRequired',
                                defaultMessage: 'First Name Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="lastName"
                        label={formatMessage({
                            id: 'createAccount.lastNameText',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            id="lastName"
                            field="customer.lastname"
                            autoComplete="family-name"
                            validate={isRequired}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-lastname"
                            aria-label={formatMessage({
                                id: 'global.lastNameRequired',
                                defaultMessage: 'Last Name Required'
                            })}
                        />
                    </Field>
                    <Field
                        id="Email"
                        label={formatMessage({
                            id: 'createAccount.emailText',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput
                            id="Email"
                            field="customer.email"
                            autoComplete="email"
                            validate={isRequired}
                            validateOnBlur
                            mask={value => value && value.trim()}
                            maskOnBlur={true}
                            data-cy="customer-email"
                            aria-label={formatMessage({
                                id: 'global.emailRequired',
                                defaultMessage: 'Email Required'
                            })}
                        />
                    </Field>
                    <Password
                        id="Password"
                        autoComplete="new-password"
                        fieldName="password"
                        isToggleButtonHidden={false}
                        label={formatMessage({
                            id: 'createAccount.passwordText',
                            defaultMessage: 'Password'
                        })}
                        validate={combine([
                            isRequired,
                            [hasLengthAtLeast, minimumPasswordLength],
                            validatePassword
                        ])}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="password"
                        aria-label={formatMessage({
                            id: 'global.passwordRequired',
                            defaultMessage: 'Password Required'
                        })}
                    />
                </>
            );
        }
    }, [
        isDisabled
    ]);

    return (
        <Fragment>
            <div className={classes.buttonContainer}>
                <Button
                    className={classes.submitButton}
                    onClick={openModal}
                >
                    <FormattedMessage
                        id={'createUser.btn.text'}
                        defaultMessage={'+ Add New User'}
                    />
                </Button>
            </div>
            {pageContent}
            <Portal>
                <Dialog
                    isOpen={isOpen}
                    onCancel={closeModal}
                    title="Add New User"
                    onConfirm={handleSubmit}
                    formProps={initialValues}
                >
                    {newUserContent}
                </Dialog>
                <Dialog
                    isOpen={!!isOpenConfirmation}
                    onCancel={closeConfirmationModal}
                    title="Delete User"
                    onConfirm={() => deleteUser()}
                >
                    <h3>
                        <FormattedMessage
                            id={'createUser.btn.text'}
                            defaultMessage={'Are you sure you want to delete next user:'}
                        />
                        <span>
                            {isOpenConfirmation}
                        </span>
                    </h3>
                </Dialog>
            </Portal>
        </Fragment>
    );
};

export default ManageUsers;

ManageUsers.propTypes = {
    classes: shape({
        users_content: string,
        usersTable: string,
        userEmail: string,
        userFirstName: string,
        userLastName: string,
        form: string,
        addNewUserForm: string,
        buttonContainer: string,
        submitButton: string,
    })
};
