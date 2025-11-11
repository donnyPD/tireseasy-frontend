import React, { Fragment, Suspense } from 'react';
import { shape, string } from 'prop-types';
import { ShoppingBag as ShoppingCartIcon, ShoppingCart } from 'react-feather';
import { useIntl } from 'react-intl';

import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';

import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './cartTrigger.module.css';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';

const MiniCart = React.lazy(() => import('../MiniCart'));

const CartTrigger = props => {
    const {
        handleLinkClick,
        handleTriggerClick,
        itemCount,
        miniCartRef,
        miniCartIsOpen,
        hideCartTrigger,
        setMiniCartIsOpen,
        miniCartTriggerRef
    } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });
    const { isMobileMenuOpen, setIsMobileMenuOpen } = props;

    const triggerClick = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(!isMobileMenuOpen);
        }
        handleTriggerClick();
    }

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage(
        {
            id: 'cartTrigger.ariaLabel',
            defaultMessage:
                'Toggle mini cart. You have {count} items in your cart.'
        },
        { count: itemCount }
    );
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;
    const triggerClassName = miniCartIsOpen
        ? classes.triggerContainer_open
        : classes.triggerContainer;

    const maybeItemCounter = itemCount ? (
        <span className={classes.counter} data-cy="CartTrigger-counter">
            {itemCountDisplay}
        </span>
    ) : null;

    const cartTrigger = (
        <Fragment>
            <div className={triggerClassName} ref={miniCartTriggerRef}>
                <button
                    aria-expanded={miniCartIsOpen}
                    aria-label={buttonAriaLabel}
                    className={classes.trigger}
                    onClick={triggerClick}
                    data-cy="CartTrigger-trigger"
                >
                    <ShoppingCart size={20} />
                    {maybeItemCounter}
                </button>
            </div>
            <Suspense fallback={null}>
                <MiniCart
                    isOpen={miniCartIsOpen}
                    setIsOpen={setMiniCartIsOpen}
                    ref={miniCartRef}
                />
            </Suspense>
        </Fragment>
    );

    return cartTrigger;
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        counter: string,
        link: string,
        openIndicator: string,
        root: string,
        trigger: string,
        triggerContainer: string
    })
};
