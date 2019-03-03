import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route} from 'react-router-dom'

//import css
import './MainApp.css'

//import compoenents..
import GetStarted from '../GetStarted'
import Login from '../Login'
import Signup from '../Signup'
import Home from '../Home'
import StartGame from '../StartGame'
import NotFound from '../NotFound'
import Quiz from '../Quiz';
import QuizResult from '../QuizResult';
import Leaderboard from '../Leaderboard'
import MyWallet from '../MyWallet';
import EarnToken from '../EarnToken'
import InviteFriends from '../InviteFriends/InviteFriends';
import InviteContacts from '../InviteContacts'
import AdvertisingOPT from '../AdvertisingOPT'
import NoAdvertisingOPT from '../NoAdvertisingOPT'
import Settings from '../Settings'
import DonateTokens from '../DonateTokens';
import SelectContinent from '../SelectContinent'
import SelectInitative from '../SelectInitiative'
import BonusReward from '../BonusReward'
import PurchaseTokens from '../PurchaseTokens'
import MiniBytes from '../MiniBytes'


function MainApp(props) {
    return (
        <div className="app-container">
            <Switch>
                <Route exact path="/" component={GetStarted} />
                <Route path="/login" component={Login} />
                <Route path="/signup" component={Signup} />
                <Route path="/home" component={Home} />
                <Route path="/start-game" component={StartGame} />
                <Route path="/questions" component={Quiz}/>
                <Route path="/quiz-result" component={QuizResult}/>
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/wallet" component={MyWallet} />
                <Route path="/earn-token" component={EarnToken} />
                <Route path="/invite-friends" component={InviteFriends}/>
                <Route path="/invite-contacts" component={InviteContacts} />
                <Route path="/advertising-opt" component={AdvertisingOPT} />
                <Route path="/no-advertising-opt" component={NoAdvertisingOPT} />
                <Route path="/settings" component={Settings} />
                <Route path="/donate-tokens" component={DonateTokens} />
                <Route path="/select-continent" component={SelectContinent} />
                <Route path="/select-initiative" component={SelectInitative} />
                <Route path="/bonus-reward" component={BonusReward} />
                <Route path="/purchase-tokens" component={PurchaseTokens} />
                <Route path="/mini-bytes" component={MiniBytes} />
                <Route component={NotFound}/>
            </Switch>
        </div>
        )
}


export default MainApp