import React, { Fragment, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Field from '@magento/venia-ui/lib/components/Field';
import { useCreateUser } from './useCreateUser';
import Password from '@magento/venia-ui/lib/components/Password';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import {
    isRequired,
    hasLengthAtLeast,
    validatePassword,
    isNotEqualToField
} from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import defaultClasses from './manageUsers.module.css';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

const EditUserForm = props => {
    const {
        classes: propClasses,
        isDisabled
    } = props;

    const { formatMessage } = useIntl();

    const talonProps = useCreateUser({
        onSubmit: props.onSubmit,
    });

    const {
        errors,
    } = talonProps;

    const classes = useStyle(defaultClasses, propClasses);
    const [isOpenPassword, setIsOpenPassword] = useState(false);

    const openPassword = (event) => {
        event.preventDefault();
        setIsOpenPassword(true);
    }

    const editFormContent = useMemo(() => {
        if (isDisabled) {
            return <LoadingIndicator />;
        } else {
            return (
                <Fragment>
                    <FormError errors={Array.from(errors.values())}/>
                    <Field
                        id="id"
                        label={formatMessage({
                            id: 'global.id',
                            defaultMessage: 'ID'
                        })}
                        classes={classes.id}
                    >
                        <TextInput
                            field="id"
                            validate={isRequired}
                            data-cy="id"
                        />
                    </Field>
                    <Field
                        id="firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            field="firstname"
                            validate={isRequired}
                            data-cy="firstname"
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
                            field="lastname"
                            validate={isRequired}
                            data-cy="lastname"
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
                            field="email"
                            validate={isRequired}
                            data-cy="email"
                        />
                    </Field>
                    {!isOpenPassword && <a
                        href="#"
                        onClick={openPassword}
                        className={classes.changePassword}
                    >
                        <FormattedMessage
                            id={'password.btn'}
                            defaultMessage={'Change Password'}
                        />
                    </a>}
                    {isOpenPassword && <div className={classes.changePasswordBlock}>
                        <Password
                            fieldName="password"
                            label="Current Password"
                            validate={isRequired}
                            autoComplete="current-password"
                            isToggleButtonHidden={false}
                            data-cy="password"
                        />
                        <div className={classes.newPassword}>
                            <Password
                                fieldName="newPassword"
                                label={formatMessage({
                                    id: 'global.newPassword',
                                    defaultMessage: 'New Password'
                                })}
                                validate={combine([
                                    isRequired,
                                    [hasLengthAtLeast, 8],
                                    validatePassword,
                                    [isNotEqualToField, 'password']
                                ])}
                                isToggleButtonHidden={false}
                                data-cy="newPassword"
                            />
                        </div>
                    </div>}
                </Fragment>
            )
        }
    }, [isDisabled, isOpenPassword]);

    return (
        <>
            {editFormContent}
        </>
    )
};

export default EditUserForm;

EditUserForm.propTypes = {
    classes: shape({
        changePassword: string,
        changePasswordBlock: string,
        root: string,
        field: string,
        email: string,
        id: string,
        firstname: string,
        lastname: string,
        buttons: string,
        passwordLabel: string,
        password: string,
        newPassword: string
    })
};
