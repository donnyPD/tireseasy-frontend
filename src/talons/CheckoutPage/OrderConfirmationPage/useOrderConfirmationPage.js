import { useEffect, useState } from 'react';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { setUserOnOrderSuccess } from '@magento/peregrine/lib/store/actions/user/asyncActions';
import { useLazyQuery, useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './orderConfirmationPage.gql';
import { useDispatch } from 'react-redux';

export const flattenGuestCartData = data => {
    if (!data) {
        return;
    }
    const { cart } = data;
    const { shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = `${
        address.selected_shipping_method.carrier_title
    } - ${address.selected_shipping_method.method_title}`;

    return {
        city: address.city,
        country: address.country.label,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region.label,
        shippingMethod,
        street: address.street
    };
};

export const flattenCustomerOrderData = data => {
    if (!data) {
        return;
    }

    const { customer } = data;
    const order = customer?.orders?.items?.[0];
    if (!order || !order.shipping_address) {
        // Return an empty response if no valid order or shipping address exists
        return;
    }
    const { shipping_address: address } = order;

    return {
        city: address.city,
        country: address.country_code,
        email: customer.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region,
        street: address.street,
        shippingMethod: order.shipping_method
    };
};

export const useOrderConfirmationPage = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getOrderConfirmationDetailsQuery,
        getSuccessRedirectPunchoutUrlQuery,
    } = operations;

    const [{ isSignedIn, token }] = useUserContext();
    const [punchoutSuccessData, setPunchoutSuccessData] = useState(null);

    const [
        fetchOrderConfirmationDetails,
        { data: queryData, error, loading }
    ] = useLazyQuery(getOrderConfirmationDetailsQuery);

    const flatData =
        flattenGuestCartData(props.data) || flattenCustomerOrderData(queryData);

    const dispatch = useDispatch();

    useEffect(() => {
        if (props.orderNumber && !props.data) {
            const orderNumber = props.orderNumber;
            fetchOrderConfirmationDetails({
                variables: {
                    orderNumber
                }
            });
        }

        dispatch(setUserOnOrderSuccess(true));

        return () => {
            // Reset the flag when leaving the page
            dispatch(setUserOnOrderSuccess(false));
            setPunchoutSuccessData(null);
        };
    }, [
        props.orderNumber,
        props.data,
        fetchOrderConfirmationDetails,
        dispatch
    ]);

    if (token) {
        const { data: data } = useQuery(getSuccessRedirectPunchoutUrlQuery, {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                token
            }
        });
        if (data && data.GetSuccessRedirectPunchoutUrl && !punchoutSuccessData) {
            setPunchoutSuccessData(data.GetSuccessRedirectPunchoutUrl);
        }
    }

    return {
        flatData,
        isSignedIn,
        error,
        loading,
        punchoutSuccessData
    };
};
