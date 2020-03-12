const express = require('express');
const app = express();

const { mongoose } = require('./db/mongoose');

const bodyParser = require('body-parser');

// Load in the mongoose models
const { Roaster, Coffee, User } = require('./db/models');

const jwt = require('jsonwebtoken');


/* MIDDLEWARE  */

// Load middleware
app.use(bodyParser.json());


// CORS HEADERS MIDDLEWARE
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");

    res.header(
        'Access-Control-Expose-Headers',
        'x-access-token, x-refresh-token'
    );

    next();
});


// check whether the request has a valid JWT access token
let authenticate = (req, res, next) => {
    let token = req.header('x-access-token');

    // verify the JWT
    jwt.verify(token, User.getJWTSecret(), (err, decoded) => {
        if (err) {
            // there was an error
            // jwt is invalid - * DO NOT AUTHENTICATE *
            res.status(401).send(err);
        } else {
            // jwt is valid
            req.user_id = decoded._id;
            next();
        }
    });
}

// Verify Refresh Token Middleware (which will be verifying the session)
let verifySession = (req, res, next) => {
    // grab the refresh token from the request header
    let refreshToken = req.header('x-refresh-token');

    // grab the _id from the request header
    let _id = req.header('_id');

    User.findByIdAndToken(_id, refreshToken).then((user) => {
        if (!user) {
            // user couldn't be found
            return Promise.reject({
                'error': 'User not found. Make sure that the refresh token and user id are correct'
            });
        }


        // if the code reaches here - the user was found
        // therefore the refresh token exists in the database - but we still have to check if it has expired or not

        req.user_id = user._id;
        req.userObject = user;
        req.refreshToken = refreshToken;

        let isSessionValid = false;

        user.sessions.forEach((session) => {
            if (session.token === refreshToken) {
                // check if the session has expired
                if (User.hasRefreshTokenExpired(session.expiresAt) === false) {
                    // refresh token has not expired
                    isSessionValid = true;
                }
            }
        });

        if (isSessionValid) {
            // the session is VALID - call next() to continue with processing this web request
            next();
        } else {
            // the session is not valid
            return Promise.reject({
                'error': 'Refresh token has expired or the session is invalid'
            })
        }

    }).catch((e) => {
        res.status(401).send(e);
    })
}

/* END MIDDLEWARE  */




/* ROUTE HANDLERS */

/* Roaster ROUTES */

/**
 * GET /Roaster
 * Purpose: Get all roasters
 */
app.get('/roaster', authenticate, (req, res) => {
    // We want to return an array of all the roasters that belong to the authenticated user 
    Roaster.find({
        _userId: req.user_id
    }).then((roaster) => {
        res.send(roaster);
    }).catch((e) => {
        res.send(e);
    });
})

/**
 * POST /roasters
 * Purpose: Create a roaster
 */
app.post('/roaster', authenticate, (req, res) => {
    // We want to create a new roaster and return the new roaster document back to the user (which includes the id)
    // The roaster information (fields) will be passed in via the JSON request body
    let title = req.body.title;

    let newRoaster = new Roaster({
        title,
        _userId: req.user_id
    });
    newRoaster.save().then((roasterDoc) => {
        // the full roaster document is returned (incl. id)
        res.send(roasterDoc);
    })
});

/**
 * PATCH /roaster/:id
 * Purpose: Update a specified roaster
 */
app.patch('/roaster/:id', authenticate, (req, res) => {
    // We want to update the specified roaster (roaster document with id in the URL) with the new values specified in the JSON body of the request
    Roaster.findOneAndUpdate({ _id: req.params.id, _userId: req.user_id }, {
        $set: req.body
    }).then(() => {
        res.send({ 'message': 'updated successfully'});
    });
});

/**
 * DELETE /roaster/:id
 * Purpose: Delete a roaster
 */
app.delete('/roaster/:id', authenticate, (req, res) => {
    // We want to delete the specified roaster (document with id in the URL)
    Roaster.findOneAndRemove({
        _id: req.params.id,
        _userId: req.user_id
    }).then((removedRoasterDoc) => {
        res.send(removedRoasterDoc);

        // delete all the coffee that are in the deleted roaster
        deleteCoffeeFromRoaster(removedRoasterDoc._id);
    })
});


/**
 * GET /roaster/:roasterId/coffee
 * Purpose: Get all coffee in a specific roaster
 */
app.get('/roaster/:roasterId/coffee', authenticate, (req, res) => {
    // We want to return all coffee that belong to a specific roaster (specified by roasterId)
    Coffee.find({
        _roasterId: req.params.roasterId
    }).then((coffee) => {
        res.send(coffee);
    })
});


/**
 * POST /roaster/:roasterId/coffee
 * Purpose: Create a new coffee in a specific roaster
 */
app.post('/roaster/:roasterId/coffee', authenticate, (req, res) => {
    // We want to create a new coffee in a roaster specified by roasterId

    Roaster.findOne({
        _id: req.params.roasterId,
        _userId: req.user_id
    }).then((roaster) => {
        if (roaster) {
            // roaster object with the specified conditions was found
            // therefore the currently authenticated user can create new coffee
            return true;
        }

        // else - the roaster object is undefined
        return false;
    }).then((canCreateCoffee) => {
        if (canCreateCoffee) {
            let newCoffee = new Coffee({
                title: req.body.title,
                _roasterId: req.params.roasterId
            });
            newCoffee.save().then((newCoffeeDoc) => {
                res.send(newCoffeeDoc);
            })
        } else {
            res.sendStatus(404);
        }
    })
})

/**
 * PATCH /roaster/:roasterId/coffee/:coffeeId
 * Purpose: Update an existing coffee
 */
app.patch('/roaster/:roasterId/coffee/:coffeeId', authenticate, (req, res) => {
    // We want to update an existing coffee (specified by coffeeId)

    Roaster.findOne({
        _id: req.params.roasterId,
        _userId: req.user_id
    }).then((roaster) => {
        if (roaster) {
            // roaster object with the specified conditions was found
            // therefore the currently authenticated user can make updates to coffee within this roaster
            return true;
        }

        // else - the roaster object is undefined
        return false;
    }).then((canUpdateCoffee) => {
        if (canUpdateCoffee) {
            // the currently authenticated user can update Coffee
            Coffee.findOneAndUpdate({
                _id: req.params.coffeeId,
                _roasterId: req.params.roasterId
            }, {
                    $set: req.body
                }
            ).then(() => {
                res.send({ message: 'Updated successfully.' })
            })
        } else {
            res.sendStatus(404);
        }
    })
});

/**
 * DELETE /roaster/:roasterId/coffee/:coffeeId
 * Purpose: Delete a coffee
 */
app.delete('/roaster/:roasterId/coffee/:coffeeId', authenticate, (req, res) => {

    Roaster.findOne({
        _id: req.params.roasterId,
        _userId: req.user_id
    }).then((roaster) => {
        if (roaster) {
            // roaster object with the specified conditions was found
            // therefore the currently authenticated user can make updates to coffee within this roaster
            return true;
        }

        // else - the roaster object is undefined
        return false;
    }).then((canDeleteCoffee) => {
        
        if (canDeleteCoffee) {
            Coffee.findOneAndRemove({
                _id: req.params.coffeeId,
                _roasterId: req.params.roasterId
            }).then((removedCoffeeDoc) => {
                res.send(removedCoffeeDoc);
            })
        } else {
            res.sendStatus(404);
        }
    });
});



/* USER ROUTES */

/**
 * POST /users
 * Purpose: Sign up
 */
app.post('/users', (req, res) => {
    // User sign up

    let body = req.body;
    let newUser = new User(body);

    newUser.save().then(() => {
        return newUser.createSession();
    }).then((refreshToken) => {
        // Session created successfully - refreshToken returned.
        // now we geneate an access auth token for the user

        return newUser.generateAccessAuthToken().then((accessToken) => {
            // access auth token generated successfully, now we return an object containing the auth tokens
            return { accessToken, refreshToken }
        });
    }).then((authTokens) => {
        // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
        res
            .header('x-refresh-token', authTokens.refreshToken)
            .header('x-access-token', authTokens.accessToken)
            .send(newUser);
    }).catch((e) => {
        res.status(400).send(e);
    })
})


/**
 * POST /users/login
 * Purpose: Login
 */
app.post('/users/login', (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    User.findByCredentials(email, password).then((user) => {
        return user.createSession().then((refreshToken) => {
            // Session created successfully - refreshToken returned.
            // now we geneate an access auth token for the user

            return user.generateAccessAuthToken().then((accessToken) => {
                // access auth token generated successfully, now we return an object containing the auth tokens
                return { accessToken, refreshToken }
            });
        }).then((authTokens) => {
            // Now we construct and send the response to the user with their auth tokens in the header and the user object in the body
            res
                .header('x-refresh-token', authTokens.refreshToken)
                .header('x-access-token', authTokens.accessToken)
                .send(user);
        })
    }).catch((e) => {
        res.status(400).send(e);
    });
})


/**
 * GET /users/me/access-token
 * Purpose: generates and returns an access token
 */
app.get('/users/me/access-token', verifySession, (req, res) => {
    // we know that the user/caller is authenticated and we have the user_id and user object available to us
    req.userObject.generateAccessAuthToken().then((accessToken) => {
        res.header('x-access-token', accessToken).send({ accessToken });
    }).catch((e) => {
        res.status(400).send(e);
    });
})



/* HELPER METHODS */
let deleteCoffeeFromRoaster = (_roasterId) => {
    Coffee.deleteMany({
        _roasterId
    }).then(() => {
        console.log("Coffee from " + _roasterId + " were deleted!");
    })
}




app.listen(3000, () => {
    console.log("Server is listening on port");
})