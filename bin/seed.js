const mongoose = require('mongoose');
const User = require('../models/user.model');

const users = [
  {
    username: "tester1",
    email: "tester1@tester1.com",
    passwordHash: "$2a$10$ykwAIRV8uLcuwzUSmQX/e.XwWIAzOlzlp8pWrE7Zi/JZjNAQcfJ2S" // 1Password
  },
  {
    username: "tester2",
    email: "tester2@tester2.com",
    passwordHash: "$2a$10$ykwAIRV8uLcuwzUSmQX/e.XwWIAzOlzlp8pWrE7Zi/JZjNAQcfJ2S" // 1Password
  }
];

// start the database
require("../configs/db.config");

// clear the users collection
User.collection.drop();

// seed the database with users
User
  .create(users)
  .then(newUsers => {
    // prints the new users for confirmation
    console.log({newUsers});
    // stops the database
    mongoose.disconnect();
  })
  .catch(err => console.log(`Error seeding the database: ${err}`));
