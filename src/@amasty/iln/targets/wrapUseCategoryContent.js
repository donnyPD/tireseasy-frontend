import { useMemo } from 'react';

const isEnabledFilterByCategory = (filterData, categoryId) => {
  const { visible_in_categories, categories_filter } = filterData;

  if (visible_in_categories === 'only_in_selected_categories') {
    return (
      categories_filter &&
      categories_filter.split(',').includes(categoryId.toString())
    );
  } else if (visible_in_categories === 'hide_in_selected_categories') {
    return (
      !categories_filter ||
      !categories_filter.split(',').includes(categoryId.toString())
    );
  }

  return (
    visible_in_categories === null ||
    visible_in_categories === 'visible_everywhere'
  );
};

const wrapUseCategoryContent = original => props => {
  const defaultReturnData = original(props);

  const { filters: defaultFilters } = defaultReturnData;

  const { categoryId } = props;

  const filters = useMemo(() => {
    if (!defaultFilters) {
      return null;
    }

    return defaultFilters.filter(({ amshopby_filter_data }) =>
      isEnabledFilterByCategory(amshopby_filter_data, categoryId)
    );
  }, [categoryId, defaultFilters]);

  return {
    ...defaultReturnData,
    filters
  };
};

export default wrapUseCategoryContent;
