const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User.model');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
});

passport.use(new LocalStrategy({
        usernameField: 'email', // change authen
        passwordField: 'password' // by default
    },
    (email, password, done) => {
        
        User.findOne({email})
            .then(user => {
                if (!user || !bcrypt.compareSync(password, user.passwordhash)) {
                    return done(null, false, {
                        message: "Incorrect username and/or password"
                    });
                }

                console.log({user});
                done(null, user);
            })
            .catch(err => done(err));
    }
));
