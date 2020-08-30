const {Schema, model} = require('mongoose');


// posts will need
// -title
// -content
// -user object.id ref
// -image
// -reference to city/cities
// -time premiting have comments array

const postSchema = new Schema(
  {
    title: { 
      type: String,
      trim: true
    },
    content: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: { 
      type: String,
      default: "https://res.cloudinary.com/dllcgl1lt/image/upload/v1598816216/default_ckcccr.jpg"
    },
    location: { 
      type: [{ type: String }],
      trim: true
     }
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);