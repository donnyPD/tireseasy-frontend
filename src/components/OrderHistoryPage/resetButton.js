import React from 'react';
import { useFormApi } from 'informed';
import { useIntl } from 'react-intl';
import { func } from 'prop-types';
import { X as ClearIcon } from 'react-feather';

import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

const clearIcon = <Icon src={ClearIcon} size={24} />;

const ResetButton = props => {
    const { onReset } = props;
    const formApi = useFormApi();

    const handleReset = () => {
        formApi.reset();

        if (onReset) {
            onReset();
        }
    };
    const { formatMessage } = useIntl();
    return (
        <Trigger
            action={handleReset}
            addLabel={formatMessage({
                id: 'global.clearText',
                defaultMessage: 'Clear Text'
            })}
        >
            {clearIcon}
        </Trigger>
    );
};

export default ResetButton;

ResetButton.propTypes = {
    onReset: func
};
