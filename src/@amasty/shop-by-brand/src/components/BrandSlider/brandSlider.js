import React from 'react';
import { useBrandSlider } from '../../talons/useBrandSlider';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './brandSlider.css';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import SlickSlider from 'react-slick';
import Item from './item';

const BrandSlider = props => {
  const {
    slider_title: sliderTitle,
    slider_header_color: headerBg,
    slider_title_color: headerColor,
    items_number: slidesToShow,
    simulate_touch: draggable,
    autoplay,
    autoplay_delay: autoplaySpeed,
    pagination_show: dots,
    infinity_loop: infinite,
    slider_width: sliderWidth,
    pagintaion_clickable: paginationClickable,
    breakpoints,
    buttons_show: arrows,
    ...slideSettings
  } = props;

  const { loading, error, items } = useBrandSlider({ ...props });
  const classes = mergeClasses(defaultClasses, props.classes);

  if (loading) {
    return <LoadingIndicator />;
  }

  if (error || !Array.isArray(items) || !items.length) {
    return null;
  }

  const list = items.map(item => (
    <Item key={item.label} {...item} {...slideSettings} />
  ));

  const carouselSettings = {
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    draggable,
    autoplay,
    autoplaySpeed: autoplay && autoplaySpeed ? autoplaySpeed : 3000,
    dots,
    arrows,
    centerMode: false,
    infinite: items.length > slidesToShow && infinite,
    responsive: breakpoints,
    dotsClass: paginationClickable ? 'slick-dots' : 'slick-dots disabled',
    pauseOnHover: true
  };

  return (
    <div className={classes.root} style={{ backgroundColor: headerBg }}>
      <div
        className={classes.header}
        style={{ color: headerColor }}
      >
        {sliderTitle}
      </div>

      <div style={{ maxWidth: sliderWidth }} className={classes.carousel}>
        <SlickSlider {...carouselSettings}>{list}</SlickSlider>
      </div>
    </div>
  );
};

BrandSlider.defaultProps = {
  image_width: 100,
  items_number: 6
};

export default BrandSlider;
