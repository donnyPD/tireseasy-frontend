import { gql } from '@apollo/client';

export const GET_LOCATION_DATA_LIST = gql`
    query ($contactHash: String!) {
        locationDataList(contact_hash: $contactHash) {
            id
            name
        }
    }
`;

export const GENERATE_LOCATION_CHANGE = gql`
    mutation LocationChange($locationId: String!, $contactHash: String!) {
        generateLocationChange(location_id: $locationId, contact_hash: $contactHash) {
            location_url_change
        }
    }
`;

export default {
    getLocationDataListQuery: GET_LOCATION_DATA_LIST,
    generateLocationChangeMutation: GENERATE_LOCATION_CHANGE
};
