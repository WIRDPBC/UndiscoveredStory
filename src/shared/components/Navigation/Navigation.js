/**
 * Created By Nikita Mittal
 * 24th Feb 2019
 */

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'


//import css
import './Navigation.css'

//import components..
import NavUser from '../../icons/NavUser';

class Navigation extends PureComponent {
    static propTypes = {

    }

    static defaultProps = {

    }

    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="navigation-container">
                <div className="navigation-header-container">
                    <div className="navigation-header-data-container">
                        <NavUser style={{ width: "60px", height: "60px" }} />
                        <div className="navigation-header-user-data-container">
                            <div className="navigation-header-user-name-container">Mary Doe</div>
                            <div className="navigation-header-user-level-container">(Level)</div>
                        </div>
                    </div>

                </div>
                <div className="navigation-data-container">
                    <Link to={"/home"}>
                        <div className="navigation-data-item-container">
                            <div className="navigation-data-item-text-container">Home</div>
                        </div>
                    </Link>

                    <div className="navigation-data-item-container">
                        <div className="navigation-data-item-text-container">Mini Bytes</div>
                    </div>

                    <div className="navigation-data-item-container">
                        <div className="navigation-data-item-text-container">Donate</div>
                    </div>

                    <Link to={"/leaderboard"}>
                        <div className="navigation-data-item-container">
                            <div className="navigation-data-item-text-container">Leaderboard</div>
                        </div>
                    </Link>

                    <Link to={'/earn-token'}>
                        <div className="navigation-data-item-container">
                            <div className="navigation-data-item-text-container">Earn Tokens</div>
                        </div>
                    </Link>

                    <Link to={"/wallet"}>
                        <div className="navigation-data-item-container">
                            <div className="navigation-data-item-text-container">My Wallet</div>
                        </div>
                    </Link>

                    <div className="navigation-data-item-container">
                        <div className="navigation-data-item-text-container">Bonus Reward</div>
                    </div>

                    <Link to={'/settings'}>
                        <div className="navigation-data-item-container">
                            <div className="navigation-data-item-text-container">Setting</div>
                        </div>
                    </Link>


                </div>

                <Link to={'/login'}>
                    <div className="navigation-data-sign-out-container">
                        Sign Out
                    </div>
                </Link>
            </div>
        )
    }
}

export default Navigation