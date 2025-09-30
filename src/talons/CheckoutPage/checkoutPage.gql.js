import { gql } from '@apollo/client';
import { CheckoutPageFragment } from './checkoutPageFragments.gql';
import { ItemsReviewFragment } from './ItemsReview/itemsReviewFragments.gql';
import { OrderConfirmationPageFragment } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragments.gql';

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
            order {
                order_number
            }
        }
    }
`;

// A query to fetch order details _right_ before we submit, so that we can pass
// data to the order confirmation page.
export const GET_ORDER_DETAILS = gql`
    query getOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...OrderConfirmationPageFragment
        }
    }
    ${OrderConfirmationPageFragment}
`;

export const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
            ...ItemsReviewFragment
        }
    }
    ${CheckoutPageFragment}
    ${ItemsReviewFragment}
`;

export const GET_CUSTOMER = gql`
    query GetCustomerForCheckout {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            default_shipping
            firstname
        }
    }
`;

export const GET_QUOTE_DETAILS = gql`
    query {
        getQuoteDetails {
            po_number
            customer_comment
            items {
                sku
                name
                price
                price_formatted
                qty
                row_total
                row_total_formatted
                small_image
                size
            }
        }
    }
`;

export const SET_CHECKOUT_CUSTOM_FIELDS = gql`
    mutation setCheckoutCustomFields($poNumber: String!, $customerComment: String!) {
        setCheckoutCustomFields(
            po_number: $poNumber,
            customer_comment: $customerComment
        ) {
            success
            message
            quote {
                po_number
                estimated_delivery_date
                customer_comment
                items {
                    sku
                    name
                    price
                    price_formatted
                    qty
                    row_total
                    row_total_formatted
                    small_image
                    size
                }
            }
        }
    }
`;

export default {
    createCartMutation: CREATE_CART,
    getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    getOrderDetailsQuery: GET_ORDER_DETAILS,
    placeOrderMutation: PLACE_ORDER,
    setCheckoutCustomFieldsMutation: SET_CHECKOUT_CUSTOM_FIELDS,
    getQuoteDetails: GET_QUOTE_DETAILS
};
