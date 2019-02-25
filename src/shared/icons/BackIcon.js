/**
 * Created By Nikita Mittal
 * 25th Feb 2019
 */

import React from 'react'
import PropTypes from 'prop-types';
//Custom Import..
import { getSizeDimension } from './utils'

const BackIcon = ({ fill, size, style, className, circleClassName, onClick, id }) => {
    const sizeStyle = getSizeDimension(size)
    return (
        <svg style={{ ...sizeStyle, ...style }} onClick={onClick} xmlns="http://www.w3.org/2000/svg" width="14.242" height="14.242" viewBox="0 0 14.242 14.242">
            <defs>
            </defs>
            <image id="Image_19" width="14" height="14" style={{ opacity: ".656" }} data-name="Image 19" transform="rotate(-179 7.061 7.06)" xlinkHref="data:image/png;base64,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" />
        </svg>

    )
}

export default BackIcon