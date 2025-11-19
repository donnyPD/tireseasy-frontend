import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useItemsReview } from '../../../talons/CheckoutPage/ItemsReview/useItemsReview';

import Item from './item';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './itemsReview.module.css';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useItemsReview(props);

    const {
        items: itemsInCart,
        configurableThumbnailSource
    } = talonProps;

    const items = itemsInCart.map((item, index) => (
        <Item
            key={item.uid}
            item={item}
            {...item}
            configurableThumbnailSource={configurableThumbnailSource}
        />
    ));

    return (
        <div
            className={classes.items_review_container}
            data-cy="ItemsReview-container"
        >
            <div className={classes.items_container}>
                <h2
                    data-cy="ItemsReview-totalQuantity"
                    className={classes.items_title}
                >
                    <FormattedMessage
                        id={'checkoutPage.itemsInYourOrder.new'}
                        defaultMessage={'Order Details'}
                    />
                </h2>
                <ul className={classes.list}>
                    <li className={classes.th}>
                        <div>
                            <FormattedMessage
                                id={'productList.checkout.product'}
                                defaultMessage={'Product'}
                            />
                        </div>
                        <div>
                            <FormattedMessage
                                id={'productList.checkout.price'}
                                defaultMessage={'Price'}
                            />
                        </div>
                        <div>
                            <FormattedMessage
                                id={'productList.checkout.qty'}
                                defaultMessage={'Qty'}
                            />
                        </div>
                        <div>
                            <FormattedMessage
                                id={'productList.checkout.total'}
                                defaultMessage={'Total'}
                            />
                        </div>
                        <div>
                            <FormattedMessage
                                id={'productList.checkout.eta'}
                                defaultMessage={'Delivery ETA'}
                            />
                        </div>
                    </li>
                    {items}
                </ul>

            </div>
        </div>
    );
};

export default ItemsReview;
