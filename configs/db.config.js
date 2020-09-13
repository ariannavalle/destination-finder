const mongoose = require('mongoose');

mongoose
  .connect('mongodb://heroku_swtq6sgl:hfvl60ar90mi547s2ll1a1s97@ds253398.mlab.com:53398/heroku_swtq6sgl', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  })
  .then(x => console.log(`Successfully connected to the database ${x.connections[0].name}`))
  .catch(error => {
    console.error(`An error ocurred trying to connect to the database: `, error);
    process.exit(1);
  });
