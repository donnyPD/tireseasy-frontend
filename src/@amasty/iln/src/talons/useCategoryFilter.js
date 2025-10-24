import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import DEFAULT_OPERATIONS from './categories.gql';
import { useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useFilterList } from './useFilterList';
import { useLocation } from 'react-router-dom';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useMagentoRoute } from '@magento/peregrine/lib/talons/MagentoRoute';

const filterTree = (list, text) => {
  const patches = [...list].reduce((prev, [, val]) => {
    return [
      ...prev,
      ...(val.title.toLowerCase().includes(text.toLowerCase()) ? [val.value] : [])
    ];
  }, []);

  const uniqIds = new Set(patches);
  return new Map([...list].filter(([key]) => uniqIds.has(key)));
};

const getCurrentLevelChildren = (activeCategory, isVisibleCurrent) => {
  return activeCategory.children.length && !isVisibleCurrent
    ? activeCategory
    : { children: [activeCategory] };
};

export const useCategoryFilter = (props = {}) => {
  const { filterBlockSettings, filterState, filterApi, items } = props;

  const route = useMagentoRoute();

  const { type } = route;

  const { searchProps, itemProps } = useFilterList(props);

  const location = useLocation();

  const {
    render_all_categories_tree,
    render_categories_level,
    category_tree_depth,
    limit_options_show_search_box,
    is_show_search_box,
    subcategories_view,
    sort_options_by
  } = filterBlockSettings;

  const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
  const { getCategoryListQuery } = operations;

  const { data } = useQuery(getCategoryListQuery, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const { categoryList } = data || {};
  const { value: searchValue } = searchProps;

  const isActive = useCallback(
    ({ url_path, url_suffix }) => {
      const categoryUrlPath = `/${url_path}${url_suffix || ''}`;

      return location.pathname === categoryUrlPath;
    },
    [location.pathname]
  );

  const [categoryTree, flatList, activeItem] = useMemo(() => {
    const isCategoryPage = !!['CATEGORY'].includes(type);

    const list = new Map();
    let activeCategory = null;

    const itemIds = new Map(items.map(item => [item.value, { ...item }]));

    const isCategoryVisible = (category, activeCategory) => {
      const { value: id, level, count } = category;
      const isCorrectDepth = level <= category_tree_depth + 1;

      if (!count) {
        return false;
      }

      if (
        (category_tree_depth === 1 || render_categories_level === 3) &&
        activeCategory
      ) {
        // 3 -> current level children
        return level <= category_tree_depth + activeCategory.level;
      }

      if (render_categories_level === 2) {
        // 2 -> Current level
        return activeCategory
          ? level <= category_tree_depth + activeCategory.level
          : itemIds.has(id) && isCorrectDepth;
      }

      return isCorrectDepth;
    };

    const processData = (category, path = []) => {
      if (!category) {
        return;
      }

      const {
        id,
        uid,
        name,
        products,
        children,
        level,
        url_path,
        url_suffix
      } = category;

      const filterItem = itemIds.get(uid);
      const countByFilter = filterItem ? filterItem.count : 0;
      const countByTree = products ? products.total_count : 0;

      const ilnCategory = {
        value: uid.toString(),
        title: name,
        count: isCategoryPage ? countByTree : countByFilter,
        path: [...path, id.toString()],
        level,
        categoryUrl: resourceUrl(`/${url_path}${url_suffix || ''}`)
      };

      if (isActive(category)) {
        activeCategory = ilnCategory;
        ilnCategory.isActive = true;
      }

      if (
        render_all_categories_tree ||
        isCategoryVisible(ilnCategory, activeCategory)
      ) {
        list.set(ilnCategory.value, ilnCategory);
      }

      if (children) {
        const sortedChildren =
          sort_options_by === 1 // 1 - Sort options by name. Default (0) - by position
            ? [...children].sort((a, b) => a.name.localeCompare(b.name))
            : [...children].sort((a, b) => (a.position > b.position ? 1 : -1));

        ilnCategory.children = sortedChildren.map(child =>
          processData(child, ilnCategory.path)
        );
      }

      return ilnCategory;
    };

    const tree = categoryList ? processData(categoryList[0]) : null;

    const isFullTree =
      render_all_categories_tree || render_categories_level === 1; // Root level
    const isVisibleCurrent =
      render_categories_level === 2 && category_tree_depth !== 1;

    return [
      isFullTree || !activeCategory
        ? tree
        : getCurrentLevelChildren(activeCategory, isVisibleCurrent),
      list,
      activeCategory
    ];
  }, [
    items,
    categoryList,
    isActive,
    category_tree_depth,
    render_all_categories_tree,
    render_categories_level,
    type,
    sort_options_by
  ]);

  const { subcategories_expand } = filterBlockSettings;

  const visibleCategories = useMemo(
    () => (!searchValue ? flatList : filterTree(flatList, searchValue)),
    [searchValue, flatList]
  );

  const selectedCategories = useMemo(
    () => new Set(filterState && [...filterState].map(({ value }) => value)),
    [filterState]
  );

  return {
    categoryTree,
    itemProps: {
      ...itemProps,
      filterState,
      filterApi,
      selectedCategories,
      subcategoriesExpand: subcategories_expand,
      visibleCategories,
      subcategoriesView: subcategories_view,
      activeItem
    },
    searchProps: {
      ...searchProps,
      isShowSearchBox:
        is_show_search_box && limit_options_show_search_box <= flatList.size
    }
  };
};
