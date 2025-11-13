import React from 'react';
import { FormattedMessage } from 'react-intl';
import { shape, string } from 'prop-types';

import defaultClasses from './invoicePage.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

const SelectSize = props => {
    const {optionsSize, pageSize, setPageSize} = props;

    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.selectBlock}>
            <span className={classes.selectLabel}>
                <FormattedMessage
                    id={'order.history.selectLabel'}
                    defaultMessage={'Show per page'}
                />
            </span>
            <select
                name="size"
                className={classes.select}
                value={pageSize}
                onChange={e => setPageSize(e.target.value)}
            >
                {optionsSize.map(opt => (
                    <option key={opt.label} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default SelectSize;

SelectSize.propTypes = {
    classes: shape({
        selectBlock: string,
        selectLabel: string,
        select: string
    })
};
