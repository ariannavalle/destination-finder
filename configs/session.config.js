const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const mongoose = require('mongoose');

module.exports = app => {
  app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 5 * 60 * 1000 }, // 5 minute session length
      store: new MongoStore({
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60 // = 1 day
      })
    })
  );
};
