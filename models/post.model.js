const {Schema, model} = require('mongoose');

const postSchema = new Schema(
  {
    title: { type: String },
    message: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    image: {type: String}
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);