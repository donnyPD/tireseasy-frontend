import React, { Fragment, Suspense, useMemo } from 'react';
import { string } from 'prop-types';
import { useBrandPage } from '../../talons/useBrandPage';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Gallery from '@magento/venia-ui/lib/components/Gallery';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import ProductSort from '@magento/venia-ui/lib/components/ProductSort';
import Breadcrumbs from './breadcrumbs';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import defaultClasses from '@magento/venia-ui/lib/RootComponents/Category/category.module.css';
import brandPageClasses from './brandPage.css';
import { FormattedMessage } from 'react-intl';
import FilterModalOpenButton from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import SortedByContainer from '@magento/venia-ui/lib/components/SortedByContainer';

const FilterModal = React.lazy(() =>
  import('@magento/venia-ui/lib/components/FilterModal')
);
const FilterSidebar = React.lazy(() =>
  import('@magento/venia-ui/lib/components/FilterSidebar')
);

const BrandPage = props => {
  const { brand } = props;
  const talonProps = useBrandPage({ brand });
  const classes = mergeClasses(defaultClasses, brandPageClasses, props.classes);

  const {
    items,
    totalPagesFromData,
    filters,
    isLoading,
    pageControl,
    sortProps,
    pageTitle,
    brandDescription,
    brandImage,
    totalCount
  } = talonProps;

  const [currentSort] = sortProps;
  const shouldShowFilterButtons = filters && filters.length;

  // If there are no products we can hide the sort button.
  const shouldShowSortButtons = totalPagesFromData;

  const maybeFilterButtons = shouldShowFilterButtons ? (
    <FilterModalOpenButton filters={filters} />
  ) : null;

  const filtersModal = shouldShowFilterButtons ? (
    <FilterModal filters={filters} />
  ) : null;

  const sidebar = shouldShowFilterButtons ? (
    <FilterSidebar filters={filters} />
  ) : null;

  const maybeSortButton = shouldShowSortButtons ? (
    <ProductSort sortProps={sortProps} />
  ) : null;

  const maybeSortContainer = shouldShowSortButtons ? (
    <SortedByContainer currentSort={currentSort} />
  ) : null;

  const categoryResultsHeading =
    totalCount > 0 ? (
      <FormattedMessage
        id={'categoryContent.resultCount'}
        values={{
          count: totalCount
        }}
        defaultMessage={'{count} Results'}
      />
    ) : null;

  const content = useMemo(() => {
    if (totalPagesFromData) {
      return (
        <Fragment>
          <section className={classes.gallery}>
            <Gallery items={items} />
          </section>
          <div className={classes.pagination}>
            <Pagination pageControl={pageControl} />
          </div>
        </Fragment>
      );
    } else {
      if (isLoading) {
        return <LoadingIndicator />;
      } else {
        return <NoProductsFound />;
      }
    }
  }, [
    classes.gallery,
    classes.pagination,
    isLoading,
    items,
    pageControl,
    totalPagesFromData
  ]);

  const brandDescriptionBlock = brandDescription ? (
    <RichContent html={brandDescription} />
  ) : null;

  const imageBlock = brandImage ? (
    <div className={classes.imageContainer}>
      <img src={`/${brandImage}`} alt={pageTitle} className={classes.image} />
    </div>
  ) : null;

  return (
    <Fragment>
      <Breadcrumbs currentBrand={pageTitle} />
      <Title>{pageTitle}</Title>
      <Meta name="title" content={pageTitle} />
      <article className={classes.root}>
        <div className={classes.categoryHeader}>
          <h1 className={classes.title}>
            <div className={classes.categoryTitle}>{pageTitle || '...'}</div>
          </h1>
          {imageBlock}
          {brandDescriptionBlock}
        </div>
        <div className={classes.contentWrapper}>
          <div className={classes.sidebar}>
            <Suspense fallback={null}>{sidebar}</Suspense>
          </div>
          <div className={classes.categoryContent}>
            <div className={classes.heading}>
              <div className={classes.categoryInfo}>
                {categoryResultsHeading}
              </div>
              <div className={classes.headerButtons}>
                {maybeFilterButtons}
                {maybeSortButton}
              </div>
              {maybeSortContainer}
            </div>
            {content}
            <Suspense fallback={null}>{filtersModal}</Suspense>
          </div>
        </div>
      </article>
    </Fragment>
  );
};

BrandPage.propTypes = {
  brand: string.isRequired
};

export default BrandPage;
