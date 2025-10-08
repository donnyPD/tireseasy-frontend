import { gql } from '@apollo/client';

export const GET_INVOICE_CONFIG_DATA = gql`
    query storeConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            payment_invoice_payable_to @client
            payment_invoice_mailing_address @client
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "invoice" } }
        ) {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export default {
    getInvoiceConfigQuery: GET_INVOICE_CONFIG_DATA,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
