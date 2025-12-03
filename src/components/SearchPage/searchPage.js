import React, { Fragment, Suspense, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string } from 'prop-types';
import { useSearchPage } from '../../talons/SearchPage/useSearchPage';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Pagination from '../Pagination';
import { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import Gallery from '../Gallery';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import defaultClasses from './searchPage.module.css';
import SortedByContainer, {
    SortedByContainerShimmer
} from '@magento/venia-ui/lib/components/SortedByContainer';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '../FilterSidebar';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import QuickLookups from '../QuickLookups';
import SelectSize from '../InvoicesPage/selectSize';
import Breadcrumbs from './breadcrumbs';
import noProductsFound from '../../RootComponents/Category/NoProductsFound/noProductsFound.png';
import Image from '@magento/venia-ui/lib/components/Image';

const FilterModal = React.lazy(() => import('../FilterModal'));
const FilterSidebar = React.lazy(() => import('../FilterSidebar'));

const SearchPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useSearchPage();
    const {
        availableSortMethods,
        data,
        error,
        filters,
        loading,
        pageControl,
        searchCategory,
        searchTerm,
        sortProps,
        currentStoreName,
        pageSize,
        optionsSize,
        setPageSize,
        etaList
    } = talonProps;

    const { formatMessage } = useIntl();

    const [currentSort] = sortProps;
    const metaTitle = `${currentStoreName}'s Search Result for term ${searchTerm}`;
    const content = useMemo(() => {
        if (!data && loading) {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <GalleryShimmer
                            items={Array.from({ length: 12 }).fill(null)}
                        />
                    </section>
                    <section className={classes.pagination} />
                </Fragment>
            );
        }

        if (!data && error) {
            return (
                <div aria-live="polite" className={classes.noResult}>
                    <FormattedMessage
                        id={'searchPage.noResult'}
                        defaultMessage={
                            'No results found. The search term may be missing or invalid.'
                        }
                    />
                </div>
            );
        }

        if (!data) {
            return null;
        }

        if (data.products.items.length === 0) {
            return (
                <div
                    aria-live="polite"
                    className={classes.noResult}
                    data-cy="SearchPage-noResult"
                >
                    <Image
                        alt={'No results found!'}
                        classes={{ image: classes.image, root: classes.imageContainer }}
                        src={noProductsFound}
                    />
                    <h2 className={classes.title}>
                        <FormattedMessage
                            id={'searchPage.noResultImportant'}
                            defaultMessage={'No results found!'}
                        />
                    </h2>
                </div>
            );
        } else {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <Gallery items={data.products.items} etaList={etaList} />
                    </section>
                    <section className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </section>
                </Fragment>
            );
        }
    }, [
        classes.gallery,
        classes.noResult,
        classes.pagination,
        error,
        loading,
        data,
        pageControl
    ]);

    const productsCount =
        data && data.products && data.products.total_count
            ? data.products.total_count
            : 0;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount && availableSortMethods;
    const shouldShowSortShimmer = !productsCount && loading;

    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const maybeFilterModal = shouldShowFilterButtons ? (
        <FilterModal filters={filters} />
    ) : null;

    const maybeSidebar = shouldShowFilterButtons ? (
        <FilterSidebar filters={filters} />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        availableSortMethods && (
            <ProductSort
                sortProps={sortProps}
                availableSortMethods={availableSortMethods}
            />
        )
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSelectSizeBlock = shouldShowSortButtons ? (
        availableSortMethods && (
            <SelectSize
                classes={classes}
                optionsSize={optionsSize}
                pageSize={pageSize}
                setPageSize={setPageSize}
            />
        )
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const searchResultsHeading = loading ? (
        <Shimmer width={5} />
    ) : !data ? null : searchTerm ? (
        <FormattedMessage
            id={'searchPage.searchTerm'}
            values={{
                highlight: chunks => (
                    <span className={classes.headingHighlight}>{chunks}</span>
                ),
                category: searchCategory,
                term: searchTerm
            }}
            defaultMessage="Showing results for <highlight>{term}</highlight>{category, select, null {} other { in <highlight>{category}</highlight>}}:"
        />
    ) : (
        <FormattedMessage
            id={'searchPage.searchTermEmpty'}
            defaultMessage={'Showing all results:'}
        />
    );

    const itemCountHeading =
        data && !loading ? (
            <span aria-live="polite" className={classes.totalPages}>
                {formatMessage(
                    {
                        id: 'searchPage.totalPages',
                        defaultMessage: '{totalCount} items'
                    },
                    { totalCount: productsCount }
                )}
            </span>
        ) : loading ? (
            <Shimmer width={5} />
        ) : null;

    const metaLabel = [searchTerm, `${STORE_NAME} Search`]
        .filter(Boolean)
        .join(' - ');

    return (
        <div className={classes.root_container}>
            <Breadcrumbs currentTerms={searchTerm || ''} />
            <article className={classes.root} data-cy="SearchPage-root">
                <div className={classes.sidebar}>
                    <QuickLookups />
                    <Suspense fallback={<FilterSidebarShimmer />}>
                        {maybeSidebar}
                    </Suspense>
                </div>
                <div className={classes.searchContent}>
                    <div className={classes.heading}>
                        <div
                            aria-live="polite"
                            aria-atomic="true"
                            className={classes.searchInfo}
                        >
                            {searchResultsHeading}
                            {itemCountHeading}
                        </div>
                        <div className={classes.headerButtons}>
                            {maybeFilterButtons}
                            {maybeSelectSizeBlock}
                            {maybeSortButton}
                        </div>
                        {maybeSortContainer}
                    </div>
                    {content}
                    <Suspense fallback={null}>{maybeFilterModal}</Suspense>
                </div>
                <Title>{metaTitle}</Title>
                <Meta name="title" content={metaTitle} />
                <Meta name="description" content={metaLabel} />
            </article>
        </div>
    );
};

export default SearchPage;

SearchPage.propTypes = {
    classes: shape({
        noResult: string,
        root: string,
        root_container: string,
        totalPages: string
    })
};
