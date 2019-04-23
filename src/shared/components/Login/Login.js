/**
 * Created By Nikita Mittal
 * 27th Jan 2019
 */

import React, { PureComponent, Fragment } from 'react'
import PropTypes from 'prop-types'; 
import axios from 'axios'
import {connect} from 'react-redux'
import { hostUrl } from '../helper'

//import css
import './Login.css'

//import actions..
import {onUpdateLoginAction} from '../../reducers/User/actions'

//import components
import AuthContainer from '../AuthContainer'
import LoginForm from './LoginForm'

class Login extends PureComponent{

    onLogin = (values) => {
        const {onUpdateLoginAction} = this.props
        console.log("On login getting called", values)
        if(values.email && values.password){
            let url = `${hostUrl}/login`
          // let url = 'http://localhost:8083/udgtapi/user/login'
          // let url = 'https://udgt-7790b.firebaseapp.com/user/login'
         // let url = 'http://ec2-18-219-36-248.us-east-2.compute.amazonaws.com/udgtapi/user/login'
          console.log("Login Url", url)
            let formData = {
                    Email : values.email,
                    Password : values.password,
                    crossDomain: true
            }

            const config = {
                headers: { 
                    'content-type': 'application/json',
                 },
                //  withCredentials: true
              }

            axios.post(url, formData, config)
            .then(res => {
                console.log("Logged in successfully!",JSON.stringify(res.data))
                if(res && res.data){
                    let authenticationToken = res.data.authenticationToken
                    localStorage.setItem("access_token", authenticationToken)
                    
                    onUpdateLoginAction(res.data)
                }

            })
            .catch(error => {
                console.error("Error in login", error)
            })

            
        }

    }
    render(){
        return (
            <Fragment>
                <AuthContainer>
                    <LoginForm onSubmit={this.onLogin}/>
                </AuthContainer>
            </Fragment>
        )
    }
}

const mapActionToProps = {
    onUpdateLoginAction
}


export default connect(null, mapActionToProps)(Login)