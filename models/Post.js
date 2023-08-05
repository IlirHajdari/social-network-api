const { Schema, model } = require("mongoose");
const reactionSchema = require("./Reaction");
const { formatDate } = require("../utils/formatDate");

const postSchema = new Schema(
  {
    thoughtText: { type: String, required: true, maxlength: 280 },
    createdAt: {
      type: Date,
      default: Date.now,
      get: function (timestamp) {
        return formatDate(timestamp);
      },
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

postSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Post = model("Post", postSchema);
module.exports = Post;
