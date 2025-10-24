import { gql } from '@apollo/client';

export const GET_LOCATION_DATA_LIST = gql`
    query {
        locationDataList {
            id
            name
        }
    }
`;

export default {
    getLocationDataListQuery: GET_LOCATION_DATA_LIST
};
