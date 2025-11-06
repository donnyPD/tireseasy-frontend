import { gql } from '@apollo/client';

export const GET_CUSTOMER_INVOICES = gql`
    query GetCustomerInvoices(
        $filter: CustomerInvoicesFilterInput
        $pageSize: Int!
        $currentPage: Int
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        invoices(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
            invoice_number
            order_number
            created_at
            payment_due_date
            grand_total
            status
        }
    }
`;

export default {
    getCustomerInvoicesQuery: GET_CUSTOMER_INVOICES
};
