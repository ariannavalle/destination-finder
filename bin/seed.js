const mongoose = require('mongoose');
const User = require('../models/user.model');
const Post = require('../models/post.model');

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

const posts = [
  {
    title: "Blog Test",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, pariatur aut. Similique, velit commodi. Aspernatur inventore debitis officia excepturi autem. Porro vel omnis doloribus consectetur in, dolorum sapiente id neque!",
    image: "https://res.cloudinary.com/dllcgl1lt/image/upload/v1598739087/iwmikpcenzvysm2qnsni.jpg",
    location: ["Seattle"],
    user: "5f4a7106f5c57a1e05ef9fbc" // user: tester1
  },
  {
    title: "Blog Test2",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit, pariatur aut. Similique, velit commodi. Aspernatur inventore debitis officia excepturi autem. Porro vel omnis doloribus consectetur in, dolorum sapiente id neque!",
    image: "https://res.cloudinary.com/dllcgl1lt/image/upload/v1598819778/wpwwumyeovgqji2vqgdi.jpg",
    location: ["tatooine"],
    user: "5f4a7106f5c57a1e05ef9fbd" // user: tester2
  }
];

// start the database
require("../configs/db.config");

// clear the users collection
User.collection.drop();
Post.collection.drop();

// seed the database with users
User
  .create(users)
  .then(newUsers => {
    Post
      .create(posts)
      .then(postsFromDB => {
        // prints the new users for confirmation
        console.log({newUsers});
        console.log({postsFromDB});
        // stops the database
        mongoose.disconnect();
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(`Error seeding the database: ${err}`));
