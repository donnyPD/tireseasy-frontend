import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingMethod.module.css';

const ShippingMethod = props => {
    const { data, classes: propsClasses } = props;
    const { shippingMethod } = data;
    const classes = useStyle(defaultClasses, propsClasses);

    return (
        <div
            className={classes.root}
            data-cy="OrderDetails-ShippingMethod-root"
        >
            <div className={classes.heading}>
                <FormattedMessage
                    id="orderDetails.shippingMethodLabel"
                    defaultMessage="Shipping Method"
                />
            </div>
            <div className={classes.method}>{shippingMethod}</div>
        </div>
    );
};

export default ShippingMethod;

ShippingMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        method: string,
        tracking: string,
        trackingRow: string
    }),
    data: shape({
        shippingMethod: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        )
    })
};
