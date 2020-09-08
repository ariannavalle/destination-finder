const {Schema, model} = require('mongoose');

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
    city: { type: Schema.Types.ObjectId, ref: "City" }
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);