import React from 'react';
import { useFormApi } from 'informed';
import { useIntl, FormattedMessage } from 'react-intl';
import { func } from 'prop-types';
import { X as ClearIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import defaultClasses from './orderHistoryPage.module.css';
import { useStyle } from "@magento/venia-ui/lib/classify";

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const formApi = useFormApi();
    const classes = useStyle(defaultClasses, props.classes);

    const handleReset = () => {
        formApi.reset();

        if (onReset) {
            onReset();
        }
    };
    const { formatMessage } = useIntl();
    return (
        <Trigger
            className={classes.resetButton}
            action={handleReset}
            addLabel={formatMessage({
                id: 'global.clearText',
                defaultMessage: 'Clear All'
            })}
        >
            <FormattedMessage
                id={'order.clear.text'}
                defaultMessage={'Clear All'}
            />
            {clearIcon}
        </Trigger>
    );
};

export default ResetButton;

ResetButton.propTypes = {
    onReset: func
};
