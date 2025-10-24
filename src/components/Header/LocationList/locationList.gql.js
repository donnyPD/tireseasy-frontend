import { gql } from '@apollo/client';

export const GET_LOCATION_DATA_LIST = gql`
    query ($contactHash: String!) {
        locationDataList(contact_hash: $contactHash) {
            id
            name
        }
    }
`;

export default {
    getLocationDataListQuery: GET_LOCATION_DATA_LIST
};
