import { gql } from '@apollo/client';

/**
 * GraphQL query to get the list of available years
 */
export const GET_YEAR_LIST = gql`
    query GetYearList {
        yearList {
            years
        }
    }
`;

/**
 * GraphQL query to get the list of makes for a specific year
 */
export const GET_MAKE_LIST = gql`
    query GetMakeList($year: Int!) {
        makeList(year: $year) {
            makes
        }
    }
`;

/**
 * GraphQL query to get the list of models for a specific year and make
 */
export const GET_MODEL_LIST = gql`
    query GetModelList($year: Int!, $make: String!) {
        modelList(year: $year, make: $make) {
            models
        }
    }
`;

/**
 * GraphQL query to get the list of trims for a specific year, make and model
 */
export const GET_TRIMS = gql`
    query GetTrims($year: Int!, $make: String!, $model: String!) {
        getTrims(year: $year, make: $make, model: $model) {
            items
        }
    }
`;

/**
 * GraphQL query to get options for a specific year, make and model
 */
export const GET_OPTIONS = gql`
    query GetOptions($year: Int!, $make: String!, $model: String!, $trim: String) {
        getOptions(year: $year, make: $make, model: $model, trim: $trim) {
             items {
                 trim
                 size
                 url
             }
        }
    }
`;

/**
 * GraphQL query to get options by VIN number
 */
export const GET_OPTIONS_BY_VIN = gql`
    query GetOptionsByVin($vin: String!) {
        getOptionsByVin(vin: $vin) {
            items {
                trim
                size
                url
            }
        }
    }
`;
