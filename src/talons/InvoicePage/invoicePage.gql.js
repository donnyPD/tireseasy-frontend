import { gql } from '@apollo/client';

export const GET_CUSTOMER_INVOICES = gql`
    query GetCustomerInvoices(
        $filter: CustomerInvoicesFilterInput
        $pageSize: Int!
        $currentPage: Int!
    ) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            invoices(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
                items {
                    payment_due_date
                    invoice_number
                    order_number
                    created_at
                    status
                    grand_total {
                        currency
                        value
                    }
                }
                page_info {
                    current_page
                    total_pages
                }
                total_count
            }
        }
    }
`;

export default {
    getCustomerInvoicesQuery: GET_CUSTOMER_INVOICES
};
