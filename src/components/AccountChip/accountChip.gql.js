import { gql } from '@apollo/client';

export const GET_CUSTOMER_DETAILS = gql`
    query accountChipQuery($contactHash: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer(contact_hash: $contactHash) {
            firstname
        }
    }
`;
