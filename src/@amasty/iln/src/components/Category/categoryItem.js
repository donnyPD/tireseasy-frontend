import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import defaultClasses from './category.css';
import Label from '../Label';
import { useCategoryItem } from '../../talons/useCategoryItem';
import Icon from '@magento/venia-ui/lib/components/Icon';

const viewOptions = {
  1: 'folding',
  2: 'flyOut',
  3: 'flyOutDesktop'
};

const CategoryItem = props => {
  const { item, ...restProps } = props;
  const talonProps = useCategoryItem(props);

  const {
    handleClick,
    tileItem,
    isSelected,
    isShowExpandBtn,
    isExpanded,
    handleExpandClick,
    isHidden,
    expandClass
  } = talonProps;

  if (isHidden) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const subCategories = item.children?.length
    ? item.children.map(category => (
        <CategoryItem key={category.value} {...restProps} item={category} />
      ))
    : null;

  const iconSrc = isExpanded ? ArrowUp : ArrowDown;

  const expandBtn = isShowExpandBtn ? (
    <button
      className={classes.expandBtn}
      onClick={handleExpandClick}
      type="button"
    >
      <Icon src={iconSrc} />
    </button>
  ) : null;

  const { isMultiSelect, showProductQuantities } = restProps;

  const className = [
    classes.item,
    classes[expandClass],
    classes[`item${isExpanded ? '_expanded' : '_hidden'}`],
    classes[viewOptions[props.subcategoriesView] || viewOptions[1]]
  ].join(' ');

  return (
    <li className={className}>
      <div className={classes.labelRoot}>
        {expandBtn}
        <Label
          item={tileItem}
          isSelected={isSelected || item.isActive}
          showProductQuantities={showProductQuantities}
          isMultiSelect={isMultiSelect}
          onClick={handleClick}
        />
      </div>

      <ul className={classes.subCategories}>{subCategories}</ul>
    </li>
  );
};

CategoryItem.propTypes = {
  classes: shape({
    root: string
  })
};

export default CategoryItem;
