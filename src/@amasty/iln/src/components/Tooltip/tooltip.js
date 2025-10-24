import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { shape, string } from 'prop-types';

import defaultClasses from './tooltip.css';

const toHTML = str => ({ __html: str });

const Tooltip = props => {
  const { tooltip, is_tooltips_enabled, tooltips_image } = props;

  if (!is_tooltips_enabled || !tooltip) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const icon = tooltips_image ? (
    <img src={tooltips_image} className={classes.image} alt="tooltip" />
  ) : (
    <span className={classes.icon} />
  );

  return (
    <span className={classes.root}>
      {icon}
      <span
        className={classes.text}
        dangerouslySetInnerHTML={toHTML(tooltip)}
      />
    </span>
  );
};

Tooltip.propTypes = {
  tooltip: string,
  classes: shape({
    root: string
  })
};

export default Tooltip;
