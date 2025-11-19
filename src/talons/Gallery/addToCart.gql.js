import { gql } from '@apollo/client';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';

const ADD_ITEM = gql`
    mutation AddItemToCart($cartId: String!, $cartItem: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
                ...MiniCartFragment
            }
            user_errors {
                code
                message
            }
        }
    }
    ${MiniCartFragment}
`;
export default {
    ADD_ITEM
};
