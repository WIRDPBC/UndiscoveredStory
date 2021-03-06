/**
import CorrectOption from './../../shared/icons/CorrectOption';
 * The code has been rewritten to make it more clear
 * and understandable with comments added
 * Utilizing object methodology to add methods
 */

const config = require('.././config').config;
const _firebase = require('firebase');
if (!_firebase.apps.length)
    _firebase.initializeApp(config)
let bcrypt = require('bcryptjs');
let secretKey = require('../secretKey');
let walletAPIurl = require('../walletAPI/walletAPIurl');
const axios = require('axios');
let jwt = require('jsonwebtoken');
let utilities = require('./utilities');
let walletAPI = require('../walletAPI/walletAPIurl')

const collectionName = require('./collectionName');

const numberOfTokenToTransfer = "88"

//Contructor requiring two params to utilize
//them in the methods defined
function CreateUser(Email, Password, eligiblityCertified, termsPolicy, firstName, lastName) {
    this.Email = Email || null;
    this.Password = Password || null;
    this.initialSignupBalance = 88;
    this.eligiblityCertified = eligiblityCertified;
    this.termsPolicy = termsPolicy;

    this.firstName = firstName;
    this.lastName = lastName;
}
/**
 * Returns the email
 */
CreateUser.prototype.getEmail = function () {
    return this.Email;
}
/**
 * Returns the hashed password
 */
CreateUser.prototype.getPassword = function () {
    return this.hashPassword(this.Password);
}
/**
 * returns the eligiblityCertified
 * @returns boolean
 */
CreateUser.prototype.eligiblityCertified = function () { return this.eligiblityCertified; }
/**
 * returns the termsPolicy
 * @returns boolean
 */
CreateUser.prototype.termsPolicy = function () { return this.termsPolicy; }
/**
 * Salt settings for hashing the password
 */
CreateUser.prototype.setSaltRounds = function (saltRounds) {
    this.saltRounds = saltRounds;
}

/**
 * returns FirstName
 */
CreateUser.prototype.getFirstName = function () {
    return this.firstName;
}

/**
 * return LastName
 */
CreateUser.prototype.getLastName = function () {
    return this.lastName;
}

/**
 * Returns the number of Salts set for the hashing
 */
CreateUser.prototype.getSaltRounds = function () {
    if (this.saltRounds === undefined || this.saltRounds === 0 || this.saltRounds === null) {
        this.saltRounds = 10;
    }
    return this.saltRounds;
}
/**
 * Returns the available balance based on the public key passed
 * This method can be utilized in the later stages
 */
CreateUser.prototype.getBalance = function (publicKey) {
    return axios.post(walletAPIurl.getBalances, { "publicKey": publicKey })
        .then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
}

/**
 * Creating wallet based on the email address set
 * using the contructor and it is fetched using the getEmail method
 */
CreateUser.prototype.createWallet = function () {
    return axios.post(walletAPIurl.createKeyPair, { "emailId": this.getEmail() })
        .then(response => {
            // returning the data here allows the caller to get it through another .then(...)
            return response.data
        })
}
/**
 * Wallet data is assigned to the userSignupData object
 */
CreateUser.prototype.setWallet = function (walletData) {
    this.walletData = walletData;
    this.userSignupData.walletData = JSON.stringify(walletData);
    console.log(`setwallet: ${this.userSignupData.walletData}`);
}

/**
 * Returns the wallet with the entire data available
 */
CreateUser.prototype.getWallet = function () {
    console.log('getwallet(): ' + JSON.stringify(this.userSignupData));
}

/**
 * Sets the initial balance
 * @requires data
 */
CreateUser.prototype.setBalance = function (data) {
    this.balance = data;
}
/**
 * Hash password is used while getPassword is called
 * @requires Password
 * @returns passwordHash
 */
CreateUser.prototype.hashPassword = function (Password) {
    this.saltRounds = this.getSaltRounds();
    var salt = bcrypt.genSaltSync(this.saltRounds);
    var passwordHash = bcrypt.hashSync(Password, salt);
    return passwordHash;
}
/**
 * Checks if the password hashed is valid or not
 * @requires hashedPassword
 * @requires simplePassword
 * @returns boolean
 */
CreateUser.prototype.checkPassword = function (hashedPassword, simplePassword) {
    return bcrypt.compareSync(simplePassword, hashedPassword);
}
/**
 * Returns the authentication token using  JWT
 * @returns authenticationToken
 */
CreateUser.prototype.getAuthenticationToken = function () {
    // expires in 24 hours
    this.AuthenticationToken = jwt.sign({ id: this.getEmail() }, secretKey, { expiresIn: 86400 });

    return this.AuthenticationToken;
}

CreateUser.prototype.addRecord = function (userSignupData) {
    let db = _firebase.firestore();
    return db.collection("users").add(userSignupData).then((documentReference) => {
        return documentReference.id;
    }).then((id) => {
        return id;
    })
}

/**
 * Signs up the user
 * @requires result object
 */
CreateUser.prototype.signup = function (res) {
    let _utilities = new utilities();
    let url = walletAPI.createKeyPair
    const metaData = {
        "emailId": this.getEmail()
    }
    axios.post(url, metaData)
        .then(data => {
            let wallet = data.data;
            if (wallet.status === 400) {
                console.log(data)
                //res.send({ data: data })
            }
            if (wallet.status === 200) {
                /**
                 * Wallet Information
                 */
                let publicKey = wallet.data.publicKey
                let walletInformation = {
                    publicKey: publicKey,
                    emailId: this.getEmail(),
                    walletMessage: 'Wallet Created!'
                }

                /**
                 * Preparing User Information
                 * for Inserting data in database
                 */

                _utilities.getDocumentIDbyEmail(this.getEmail()).then((resolved) => {
                    if (resolved.documentID == undefined) {

                        /**
                         * Generating Invitee Code
                         */
                        let inviteeCode = _utilities.generateUUIDv1();
                        let referralLink = `https://undiscoveredstory.com?email=${this.getEmail()}&inviteeCode=${inviteeCode}`
                        /**
                         * Generaing Auth Token
                         */
                        let authToken = this.getAuthenticationToken();

                        /**
                         * Storing Auth Token in Cookie
                         */
                        res.cookie("auth", authToken)

                        /**
                         * Creating Metadata for data to be inserted in Database
                         */
                        this.userSignupData = {
                            firstName: this.getFirstName(),
                            lastName: this.getLastName(),
                            authenticationToken: authToken,
                            email: this.getEmail(),
                            password: this.getPassword(),
                            signupDateTime: _firebase.firestore.Timestamp.now(),
                            lastLogin: _firebase.firestore.Timestamp.now(),
                            walletData: walletInformation,
                            balance: this.initialSignupBalance,
                            inviteeCode: inviteeCode,
                            invitedBy: '',
                            ReferralLink: referralLink,
                            termsPolicy: true,
                            eligiblityCertified: true,
                            incorrectAnswers: 0,
                            totalAnswered: 0,
                            correctAnswers: 0,
                            totalQuestionsAnsweredLastLogin: 0,
                            allowedToPlay: true
                        }

                        /**
                         * Adding record in databse
                         */
                        this.addRecord(this.userSignupData).then((documentID) => {

                            /**
                             * Smart contract activation
                             */
                            let userEmail = this.getEmail()
                            _utilities.getDocumentIDbyEmail(userEmail).then((resolved) => {
                                let db = _firebase.firestore();
                                db.collection(collectionName.users).doc(resolved.documentID).get().then(querySnapshot => {
                                    var walletPublicKey = querySnapshot.data().walletData.publicKey
                                    let url = walletAPI.buildTransaction
                                    let METADATA = {
                                        emailId: userEmail,
                                        destinationId: walletPublicKey,
                                        amount: numberOfTokenToTransfer
                                    }
                                    _axios.post(url, METADATA)
                                        .then(walletTransaction => {
                                            //console.log(walletTransaction.data)

                                            _utilities.addRecord(collectionName.transactions, walletTransaction.data).then((transactionRecordAdded) => {
                                                // console.log(`record added in ${collectionName.earnedDonatedTokens}`)
                                            })
                                        }).catch(error => {
                                            //console.log(error)
                                        })
                                })
                            })

                            res.send({
                                userSignupData: this.userSignupData,
                                Message: `successfully registered`
                            })
                        })
                    }
                    else {
                        res.send({ Message: "User already registered!" });
                    }
                })
            }
        })
        .catch(error => {
            console.error(error)
        })
}



/**
 * Validates the user to provide access to gameplay
 * @requires result object
 */
CreateUser.prototype.login = function (res) {
    this.userLoginData = {
        AuthenticationToken: this.getAuthenticationToken(),
        lastLogin: _firebase.firestore.Timestamp.now()
        // ,
        // walletData: ''
    }
    let dt = _firebase.firestore();
    let _utilities = new utilities();
    _utilities.getDocumentIDbyEmail(this.getEmail()).then((resolved) => {
        if (resolved.documentID == undefined) {
            res.send({
                Message: 'Unregistered user'
            })
        } else {
            _utilities.getEmailAndPasswordByDocumentID(resolved.documentID)
                .then((result) => {
                    let fetchedEmail = result.documentID.email;
                    let fetchedPassword = result.documentID.password;
                    let docID = resolved.documentID;
                    // console.log(`fetched password: ${fetchedPassword}`);
                    // console.log(`Email:  ${this.getEmail()}`);
                    // console.log(`fetchedEmail:  ${fetchedEmail}`);
                    // console.log(`Password:  ${this.getPassword()}`);
                    // console.log(`fetchedPassword:  ${fetchedPassword}`);
                    // console.log(`password matched:  ${this.checkPassword(fetchedPassword,this.getPassword())}`);
                    let password_ISValid = this.checkPassword(fetchedPassword, this.Password);
                    if (!password_ISValid) {
                        res.send({
                            Message: 'Invalid Password'
                        })
                    } else {
                        /**
                         * updating data and letting user to get in
                        */
                        let authToken = this.getAuthenticationToken();
                        res.cookie("auth", authToken)

                        dt.collection('users').doc(docID).update(this.userLoginData);
                        dt.collection('users').doc(docID).get().then((doc) => {
                            res.send({
                                authenticationToken: authToken,
                                lastLogin: _firebase.firestore.Timestamp.now(),
                                firstName: doc.data().firstName,
                                lastName: doc.data().lastName,
                                paypalEmail: doc.data().paypalEmail,
                                email: doc.data().email,
                                ReferralLink: doc.data().ReferralLink,
                                incorrectAnswers: doc.data().incorrectAnswers,
                                totalAnswered: doc.data().totalAnswered,
                                correctAnswers: doc.data().correctAnswers,
                                totalQuestionsAnsweredLastLogin: doc.data().totalQuestionsAnsweredLastLogin,
                                invitedBy: doc.data().invitedBy,
                                inviteeCode: doc.data().inviteeCode,
                                walletData: doc.data().walletData,
                                termsPolicy: true,
                                eligiblityCertified: true,
                                allowedToPlay: true
                            })
                        })
                    }
                })
        }
    })
}

CreateUser.prototype.updateAnswers = function (authenticationToken, res) {

}


module.exports = CreateUser;
