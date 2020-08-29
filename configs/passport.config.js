const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user.model');

passport.serializeUser((user, cb) => {
    cb(null, user._id);
});

passport.deserializeUser((id, cb) => {
    User.findById(id)
        .then(user => cb(null, user))
        .catch(err => cb(err));
});

passport.use(new LocalStrategy({
        usernameField: 'username', // changed authentication to email
        passwordField: 'password' // by default
    },
    (username, password, done) => {
        
        User.findOne({username})
            .then(user => {
                if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
                    return done(null, false, {
                        message: "Incorrect email and/or password"
                    });
                }

                console.log({foundUser: user});
                done(null, user);
            })
            .catch(err => done(err));
    }
));
