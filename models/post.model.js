const {Schema, model} = require('mongoose');

const postSchema = new Schema(
  {
    content: { type: String },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    city: { type: Schema.Types.ObjectId, ref: "City" }
  },
  {
    timestamps: true
  }
);

module.exports = model('Post', postSchema);