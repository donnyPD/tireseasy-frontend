import React from 'react';
import { shape, string } from 'prop-types';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import Image from '@magento/venia-ui/lib/components/Image';
import defaultClasses from './item.module.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer key="product-image">
                <div className={classes.images}>
                    <Image
                        alt="Placeholder for gallery item image"
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        src={transparentPlaceholder}
                    />
                </div>
            </Shimmer>
            <Shimmer width="100%" height="110px" key="product-name" />
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
