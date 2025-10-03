import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { func, shape, string } from 'prop-types';
import { Form } from 'informed';
import { useSignIn } from '@magento/peregrine/lib/talons/SignIn/useSignIn';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import Button from '@magento/venia-ui/lib/components/Button';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import defaultClasses from './signIn.module.css';
import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import Password from '@magento/venia-ui/lib/components/Password';
import FormError from '@magento/venia-ui/lib/components/FormError/formError';
import GoogleRecaptcha from '@magento/venia-ui/lib/components/GoogleReCaptcha';
import Logo from "../../assets/images/Logo_-_Color.png";

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword,
        initialValues
    } = props;

    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const {
        errors,
        handleCreateAccount,
        handleEnterKeyPress,
        signinHandleEnterKeyPress,
        handleForgotPassword,
        forgotPasswordHandleEnterKeyPress,
        handleSubmit,
        isBusy,
        setFormApi,
        recaptchaWidgetProps
    } = talonProps;

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root_container}>
            <div data-cy="SignIn-root" className={classes.root}>
                <div className={classes.logo}>
                    <img
                        style={{
                            width: '110px'
                        }}
                        src={Logo}
                        alt={'DriveLine'}
                    />
                </div>
                <h1 data-cy="SignIn-title" className={classes.title}>
                    <FormattedMessage
                        id={'signIn.titleText.new'}
                        defaultMessage={'Login to Your Account'}
                    />
                </h1>
                <FormError errors={Array.from(errors.values())} />
                <Form
                    getApi={setFormApi}
                    className={classes.form}
                    onSubmit={handleSubmit}
                    data-cy="SignIn-form"
                    initialValues={initialValues && initialValues}
                >
                    <Field
                        id="emailSignIn"
                        label={formatMessage({
                            id: 'signIn.emailAddressText',
                            defaultMessage: 'Email address'
                        })}
                    >
                        <TextInput
                            id="emailSignIn"
                            data-cy="SignIn-email"
                            autoComplete="email"
                            field="email"
                            validate={isRequired}
                            data-cy="email"
                            aria-label={formatMessage({
                                id: 'global.emailRequired',
                                defaultMessage: 'Email Required'
                            })}
                        />
                    </Field>
                    <Password
                        data-cy="SignIn-password"
                        fieldName="password"
                        id="Password"
                        label={formatMessage({
                            id: 'signIn.passwordText',
                            defaultMessage: 'Password'
                        })}
                        validate={isRequired}
                        autoComplete="current-password"
                        isToggleButtonHidden={false}
                        data-cy="password"
                        aria-label={formatMessage({
                            id: 'global.passwordRequired',
                            defaultMessage: 'Password Required'
                        })}
                    />
                    <GoogleRecaptcha {...recaptchaWidgetProps} />
                    <div className={classes.buttonsContainer}>
                        <Button
                            priority="high"
                            type="submit"
                            onKeyDown={signinHandleEnterKeyPress}
                            data-cy="SignInButton-root_highPriority"
                            disabled={Boolean(isBusy)}
                        >
                            <FormattedMessage
                                id={'signIn.signInText.new'}
                                defaultMessage={'Login'}
                            />
                        </Button>
                    </div>
                    <div className={classes.forgotPasswordButtonContainer}>
                        <LinkButton
                            classes={forgotPasswordClasses}
                            type="button"
                            onClick={handleForgotPassword}
                            onKeyDown={forgotPasswordHandleEnterKeyPress}
                            data-cy="SignIn-forgotPasswordButton"
                        >
                            <FormattedMessage
                                id={'signIn.forgotPasswordText'}
                                defaultMessage={'Forgot Password?'}
                            />
                        </LinkButton>
                    </div>
                </Form>
            </div>
            <div className={classes.info}>
                <div className={classes.info_block}>
                    <h2 data-cy="SignIn-title" className={classes.title}>
                        <FormattedMessage
                            id={'signIn.infoText'}
                            defaultMessage={'Welcome to DriveLine!'}
                        />
                    </h2>
                    <p className={classes.text}>
                        <FormattedMessage
                            id={'signIn.infoText.info'}
                            defaultMessage={'Your one-stop shop for all automotive parts. Login to manage your orders, track shipments, and access exclusive deals.'}
                        />
                    </p>
                    <div className={classes.text_block}>
                        <strong>
                            <FormattedMessage
                                id={'signIn.infoText.info'}
                                defaultMessage={'Having Trouble logging in?'}
                            />
                        </strong>
                        <h3 data-cy="SignIn-title" className={classes.title}>
                            <a href={'tel:1-888-888-8888'}>
                                <FormattedMessage
                                    id={'signIn.infoText'}
                                    defaultMessage={'1-888-888-8888'}
                                />
                            </a>
                        </h3>
                        <h6 data-cy="SignIn-title" className={classes.title_small}>
                            <FormattedMessage
                                id={'signIn.infoText'}
                                defaultMessage={'Customer Service Hours:'}
                            />
                        </h6>
                        <p>
                            <FormattedMessage
                                id={'signIn.infoText.info'}
                                defaultMessage={'Monday - Friday: 8:00 AM - 6:00 PM PST'}
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id={'signIn.infoText.info'}
                                defaultMessage={'Saturday: 9:00 AM - 3:00 PM PST'}
                            />
                        </p>
                        <p>
                            <FormattedMessage
                                id={'signIn.infoText.info'}
                                defaultMessage={'Sunday: Closed'}
                            />
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        root_container: string,
        info: string,
        info_block: string,
        text_block: string,
        title_small: string,
        text: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
