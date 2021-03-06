/**
 * Created By nikita Mittal
 * 27th Feb 2019
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom'


const AdvertisingElement = (props) => {
    const { image, imageTitle, description, advertisingId } = props
    return (
        <div className="advertising-opt-card-container">
            <div className="advertising-opt-image-container">
                <div className="advertising-opt-image-text">{imageTitle}</div>
                <div className="advertising-opt-image">
                    <img src={image} alt="Advertising Image 1" className="advertising-opt-image-element" />
                </div>
            </div>
            <div className="advertising-opt-image-description-container">
                <div>{description}</div>
                <div className="advertising-opt-comment-website-container">

                    <div className="advertising-opt-comment-text">
                        <Link to={{
                            pathname: "/advertising-opt-comment",
                            title: imageTitle,
                            image: image,
                            advertisingId: advertisingId
                        }}>
                            <span>Comment</span>
                        </Link>
                    </div>


                    <div className="advertising-opt-website-text">Visit Website</div>
                </div>
            </div>
        </div>
    )
}

export default AdvertisingElement