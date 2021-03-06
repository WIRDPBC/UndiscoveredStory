const config = require('.././config').config
const uuidv1 = require('uuid/v1')
const _firebase = require('firebase')
const collectionName = require('./collectionName')
let jwt = require('jsonwebtoken')
let bcrypt = require('bcryptjs')
let shortid = require('shortid')
let axios = require('axios')
let walletAPI = require('../walletAPI/walletAPIurl')
if (!_firebase.apps.length)
    _firebase.initializeApp(config)
/**
 * A general object to contain all the useful methods to be used frequently by the developer
 * and few of them can be used as an API
 * ex:
 * destroyAuthenticationTokenByAuthenticationToken
 * getTotalNumberOfRegisteredUsers
 * destroyAuthenticationTokenByEmail
 */
function utilities() {

}


/**
 * Returns the document ID based on the email provided
 * @returns {documentID:data} which contains the documentID of the user
 * @requires email
 */
utilities.prototype.getDocumentIDbyEmail = function (email) {
    let db = _firebase.firestore();
    let documentID = db.collection(collectionName.users).where("email", "==", email).get().then(function (querySnapshot) {
        var id;
        querySnapshot.forEach(function (doc) {
            id = doc.id;
        });
        return id;
    }).then(function (data) {
        return { documentID: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}




utilities.prototype.getDocumentIDbyEmailWithCollectionName = function (email, collectionName) {
    let db = _firebase.firestore();
    let documentID = db.collection(collectionName).where("email", "==", email).get().then(function (querySnapshot) {
        var id;
        querySnapshot.forEach(function (doc) {
            id = doc.id;
        });
        return id;
    }).then(function (data) {
        return { documentID: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}


/**
 * Will return documentID based on authenticationToken provided.
 * If the Authentication Token exists in any document
 * it will return the documentID
 * @argument authenticationToken
 * @returns documentID
 */
utilities.prototype.getDocumentIDbyAuthenticationToken = function (authenticationToken) {
    let db = _firebase.firestore();
    let documentID = db.collection('users').where("authenticationToken", "==", authenticationToken).get().then(function (querySnapshot) {
        var id;
        querySnapshot.forEach(function (doc) {
            id = doc.id;
        });
        return id;
    }).then(function (data) {
        return { documentID: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}



/**
 * Will return referralLink based on authenticationToken provided.
 * If the Authentication Token exists in any document
 * it will return the referralLink
 * @argument authenticationToken
 * @argument res
 * @returns referralLink
 */
utilities.prototype.getReferralLinkByAuthenticationToken = function (authenticationToken, res) {
    let db = _firebase.firestore();
    let documentID = db.collection('users').where("authenticationToken", "==", authenticationToken).get().then(function (querySnapshot) {
        var id;
        querySnapshot.forEach(function (doc) {
            id = doc.data().ReferralLink;
        });
        return id;
    }).then(function (data) {
        res.send({ referralLink: data })
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}

/**
 * Returns email and password of user based on the document ID
 * @returns {documentID:data} which contains the email and password based on the documentID of the user
 * @requires docID
 */
utilities.prototype.getEmailAndPasswordByDocumentID = function (docID) {
    let db = _firebase.firestore();
    let documentID = db.collection(collectionName.users).doc(docID).get().then(function (querySnapshot) {
        var id = {
            email: querySnapshot.data().email,
            password: querySnapshot.data().password
        }
        return id;
    }).then(function (data) {
        return { documentID: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}

/**
 * Returns an array with all information of all registered users
 * @returns userdata
 */
utilities.prototype.getAllRegisteredUsers = function () {
    let db = _firebase.firestore();
    let documentID = db.collection('users').get().then(function (querySnapshot) {
        var array = [];
        querySnapshot.forEach(function (doc) {
            array.push(doc.data().AuthenticationToken);
        });
        return array;
    }).then(function (data) {
        return { users: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}



utilities.prototype.getAllRegisteredUsersEmail = function () {
    let db = _firebase.firestore();
    let documentID = db.collection('users').get().then(function (querySnapshot) {
        var array = [];
        querySnapshot.forEach(function (doc) {
            array.push(doc.data().email);
        });
        return array;
    }).then(function (data) {
        return { users: data };
    }).catch(function (error) {
        console.log(error);
    });
    return documentID;
}



/**
 * Destroys the Authentication Token based on the email provided
 * @requires response object
 * @requires email
 * @returns {Message:`authentication token against ${email} has been destroyed`}
 */
utilities.prototype.destroyAuthenticationTokenByEmail = function (res, email) {
    this.getDocumentIDbyEmail(email).then((resolved) => {
        let dt = _firebase.firestore();
        dt.collection('users').doc(resolved.documentID).update({ authenticationToken: '' })
            .then(() => {
                res.send({ Message: `authentication token against ${email} has been destroyed` });
            })
    })
}


/**
 * Returns the total number of registered users in 'users' document
 * @requires response object to return the result directly from the method
 * @returns {TotalRegisteredUsers: 1}
 */
utilities.prototype.getTotalNumberOfRegisteredUsers = function (res) {
    let dt = _firebase.firestore();
    dt.collection('users').get().then((querySnapshot) => {
        let totalRegisteredUsers = 0;
        querySnapshot.forEach(() => {
            totalRegisteredUsers = totalRegisteredUsers + 1;
        })
        res.send({
            TotalRegisteredUsers: totalRegisteredUsers
        })
    })
}
/**
 * Destroys an Authentication token based on the
 * authentication token provided
 * @requires authenticationToken
 * @requires response
 * @returns Message
 */
utilities.prototype.destroyAuthenticationTokenByAuthenticationToken =
    function (authenticationToken, res) {
        this.getDocumentIDbyAuthenticationToken
            .then((resolved) => {
                let dt = _firebase.firestore();
                dt
                    .collection('users')
                    .doc(resolved.documentID)
                    .update({ authenticationToken: '' })
                    .then(() => {
                        res.send({ Message: `authentication token against ${authenticationToken} has been destroyed` })
                    })
            })
    }
/**
 * Returns UUID for User unique identification
 * which can be used in user's referral link
 * @returns string
 */
utilities.prototype.generateUUIDv1 = function () {
    // generate Invitee Code using UUID
    return JSON.stringify(uuidv1());
}



/**
 * Fetches the documentID for a specific email address
 * @requires response object
 * @readonly email
 * @returns documentID in response
 */
utilities.prototype.getDocumentID = function (res, email) {
    this.getDocumentIDbyEmail(email).then((resolved) => {
        let dt = _firebase.firestore();
        res.send(JSON.stringify(resolved.documentID))
    })
}

/**
 * gets an entire list of available auth Token against users
 */
utilities.prototype.getAllRegisteredUsersAuthToken = function (res) {
    this.getAllRegisteredUsers().then((users) => {
        res.send({ users });
    })
}


/**
 * gets an entire list of available email addresses against users
 */
utilities.prototype.getAllRegisteredUsersEmailAddress = function (res) {
    this.getAllRegisteredUsersEmail().then((users) => {
        res.send({ users });
    })
}


/**
 * A generic method to add any record based on the collection name with the meta data
 * @requires collectionName
 * @requires metadata (the object of data which needs be inserted)
 * @returns promise
 */
utilities.prototype.addRecord = function (collectionName, metadata) {
    let db = _firebase.firestore();
    return db.collection(collectionName).add(metadata).then((documentReference) => {
        return documentReference.id;
    }).then((id) => {
        return id;
    });
}



utilities.prototype.deleteUserByDocumentID = function (req, res) {
    let db = _firebase.firestore();
    //51t5rrZp0Ew71H7nwrZV
    //K4FqQiCaHjmZcfmLdfbT
    db.collection('users').doc("K4FqQiCaHjmZcfmLdfbT").delete().then(() => {
        console.log('deleted');
    })
}



utilities.prototype.getLastAnswers = function (documentID) {
    let db = _firebase.firestore();
    //51t5rrZp0Ew71H7nwrZV
    //K4FqQiCaHjmZcfmLdfb
    let userData = db.collection("users").doc(documentID).get().then((documentSnapshot) => {
        let data =
        {
            incorrectAnswers: documentSnapshot.data().incorrectAnswers,
            totalAnswered: documentSnapshot.data().totalAnswered,
            correctAnswers: documentSnapshot.data().correctAnswers,
            totalQuestionsAnsweredLastLogin: documentSnapshot.data().totalQuestionsAnsweredLastLogin,
            lastLogin: documentSnapshot.data().lastLogin,
            email: documentSnapshot.data().email
        }
        return data
    }).then((data) => {
        return data;
    })
    return userData

}


/**
 * Generates an Auth token
 * which can be used for generating
 * Auth Token for Signup or Forget Password
 */
utilities.prototype.generateAuthToken = function (id) {
    let AuthenticationToken = jwt.sign({ id: id }, secretKey, { expiresIn: 86400 });
    return AuthenticationToken;
}


/**
 * Returns a hashed password to be stored in the database
 * @requires password
 * @returns passwordHash
 */
utilities.prototype.hashPassword = function (password) {
    let saltRounds = 10;
    let salt = bcrypt.genSaltSync(saltRounds);
    let passwordHash = bcrypt.hashSync(Password, salt);
    return passwordHash;
}


/**
 * Generates a random code which can be used
 * for password update / Forgot password mechanism
 */
utilities.prototype.generateShortID = function () {
    return shortid.generate()
}


utilities.prototype.getWalletAddressByEmail = function (email) {

    //51t5rrZp0Ew71H7nwrZV
    //K4FqQiCaHjmZcfmLdfb
    this.getDocumentIDbyEmail(email).then((resolved) => {
        let db = _firebase.firestore();
        db.collection(collectionName.users)
            .doc(resolved.documentID)
            .get().then(querySnapshot => {

                    return querySnapshot.data().walletData.publicKey

            })
    })

}


module.exports = utilities;