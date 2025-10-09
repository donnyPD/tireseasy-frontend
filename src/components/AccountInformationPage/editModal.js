import React from 'react';
import { useIntl } from 'react-intl';
import { shape, string, bool, array, func, object } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import EditForm from './editForm';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Dialog from './Dialog';
import GoogleReCaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import defaultClasses from './editModal.module.css';

const EditModal = props => {
    const {
        classes: propClasses,
        formErrors,
        onCancel,
        onChangePassword,
        onSubmit,
        initialValues,
        isDisabled,
        isOpen,
        shouldShowNewPassword,
        recaptchaWidgetProps
    } = props;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const dialogFormProps = { initialValues };

    return (
        <>
            <Dialog
                classes={{ body: classes.bodyEditAccountInformation }}
                confirmText={'Save'}
                formProps={dialogFormProps}
                isOpen={isOpen}
                onCancel={onCancel}
                onConfirm={onSubmit}
                shouldDisableAllButtons={isDisabled}
                shouldDisableConfirmButton={isDisabled}
                shouldUnmountOnHide={true}
                title={formatMessage({
                    id: 'accountInformationPage.editAccount.new',
                    defaultMessage: 'Edit Information'
                })}
            >
                <FormError
                    classes={{ root: classes.errorContainer }}
                    errors={formErrors}
                />
                <EditForm
                    handleChangePassword={onChangePassword}
                    shouldShowNewPassword={shouldShowNewPassword}
                />
                <GoogleReCaptcha {...recaptchaWidgetProps} />
            </Dialog>
        </>
    );
};

export default EditModal;

EditModal.propTypes = {
    classes: shape({
        errorContainer: string
    }),
    formErrors: array,
    handleCancel: func,
    handleSubmit: func,
    initialValues: object,
    isDisabled: bool,
    isOpen: bool,
    recaptchaWidgetProps: shape({
        containerElement: func,
        shouldRender: bool
    })
};
