import { gql } from '@apollo/client';

export const GET_USER_LIST = gql`
    query {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        contactList {
            firstname
            lastname
            email
            id
            hash
        }
    }
`;

export const CREATE_USER = gql`
    mutation CreateContact(
        $firstname: String!
        $lastname: String!
        $password: String!
        $email: String!
    ) {
        createContact(
            input: {
                firstname: $firstname
                lastname: $lastname
                email: $email
                password: $password
            }
        ) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            firstname
            lastname
            email
            id
            hash
        }
    }
`;

export const DELETE_USER = gql`
    mutation DeleteContact(
        $email: String!
    ) {
        deleteContact(
            email: $email
        ) {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            success
            message
        }
    }
`;

export default {
    getUserListQuery: GET_USER_LIST,
    createUserMutation: CREATE_USER,
    deleteUserMutation: DELETE_USER
};
