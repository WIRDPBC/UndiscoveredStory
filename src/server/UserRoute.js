const express = require('express');
const UserRouter = express.Router();
let CreateUser = require('./Modal/UserModal');
let UserAuthentication = require('./Modal/UserAuthentication');
let updateUserInformation = require('./Modal/updateUserInformation');
// This file is used for routing to the required method

UserRouter
    .route('/create')
    .post(function (req, res) {
        let email = req.body.Email;
        let password = req.body.Password;
        CreateUser = new CreateUser(email, password);

        res.send(JSON.stringify(CreateUser.signup()));
        // res.sendStatus('Data: ' + CreateUser.getBalance());

    });


UserRouter
    .route('/login')
    .post(function (req, res) {
        let email = req.body.Email;
        let password = req.body.Password;
        CreateUser = new CreateUser(email, password);
        res.send(JSON.stringify(CreateUser.login()));
    });


UserRouter
    .route('/authenticate')
    .post(function (req, res) {
        let email = req.body.Email;
        // let authenticationToken = req.body.AuthenticationToken;
        let authenticate = req.body.Authenticate;
        UserAuthentication = new UserAuthentication(email, authenticate);
        UserAuthentication.getAuthenticationToken();
        setTimeout(function () { }, 3000);
        res.send({ token: UserAuthentication.getAuthToken() });
    });


UserRouter.route('/updateUserData').post(function (req, res) {
    /**
     * Usage:
     * {
     * firstName: '',
     * lastName: '',
     * email: '',
     * paypalEmail:'',
     * authenticationToken: ''
     * }
     */

    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let paypalEmail = req.body.paypalEmail;
    updateUserInformation = new updateUserInformation(firstName, lastName, email, paypalEmail);




  updateUserInformation.update(res);



});

module.exports = UserRouter;