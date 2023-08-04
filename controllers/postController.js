const Post = require("../models/Post");
const User = require("../models/User");
const Reaction = require("../models/Reaction");

module.exports = {
  async getPosts(req, res) {
    try {
      const posts = await Post.find();

      res.json(posts);
    } catch (err) {
      console.log("Looks like something went wrong getting the posts.", err);
      return res.status(500).json(err);
    }
  },

  async getSinglePost(req, res) {
    try {
      const post = await Post.findOne({
        _id: req.params.postId,
      }).select("-__v");

      if (!post) {
        return res
          .status(404)
          .json({ message: "Sorry, no post with that ID!" });
      }

      res.json(post);
    } catch (err) {
      console.log("Looks like something went wrong getting that post", err);
      return res.status(500).json(err);
    }
  },

  async createPost(req, res) {
    try {
      const newPost = await Post.create(req.body);
      const userId = req.body.userId;

      await User.findByIdAndUpdate(userId, {
        $push: { posts: newPost._id },
      });

      res.json(newPost);
    } catch (err) {
      console.log(
        "Looks like something went wrong creating a new post...",
        err
      );
      res.status(500).json(err);
    }
  },

  async updatePost(req, res) {
    try {
      const updatedPost = await Post.findOneAndUpdate(
        { _id: req.params.postId },
        { $set: req.body },
        { new: true }
      );

      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }

      res.json(updatedPost);
    } catch (err) {
      console.log("Looks like something went wrong updated that post!", err);
      res.status(500).json(err);
    }
  },

  async deletePost(req, res) {
    try {
      const deletedPost = await Post.findOneAndDelete({
        _id: req.params.postId,
      });

      if (!deletedPost) {
        return res
          .status(404)
          .json({ message: "No Post was found with the ID." });
      }

      res.json(deletedPost);
      console.log(`Deleted: ${deletedPost}`);
    } catch (err) {
      console.log("Looks like something went wrong deleting that post...", err);
      res.status(500).json(err);
    }
  },

  // Reaction Controllers

  async addReaction(req, res) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!post) {
        return res
          .status(404)
          .json({ message: "No post was found with that ID." });
      }

      res.json(post);
    } catch (err) {
      console.log(
        "Looks like something went wrong when adding that reaction...",
        err
      );
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const post = await Post.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!post) {
        return res
          .status(404)
          .json({ message: "No post was found with that ID." });
      }

      res.json(post);
    } catch (err) {
      console.log(
        "Looks like something went wrong when removing that reaction...",
        err
      );
      res.status(500).json(err);
    }
  },
};
