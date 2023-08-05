const User = require("../models/User");
const Post = require("../models/Post");

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (err) {
      console.log("Looks like something went wrong getting the users...", err);
      return res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select("__v");

      if (!user) {
        return res.status(404).json({ message: "No user found with that ID" });
      }

      res.json(user);
    } catch (err) {
      console.log(
        "Looks like something went wrong getting that specific user...",
        err
      );
      return res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);

      res.json(newUser);
    } catch (err) {
      console.log(
        "Looks like something went wrong creating a new user...",
        err
      );
      return res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const updatedUser = await User.findAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found " });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log("Looks like something went wrong updated that user...", err);
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findAndDelete({
        _id: req.params.userId,
      });

      if (!deletedUser) {
        return res.status(404).json({ message: "No user with that ID found" });
      }

      await Post.deleteMany({ username: deletedUser.username });

      res.json(deletedUser);
      console.log(`Deleted: ${deletedUser}`);
    } catch (err) {
      console.log(
        "Looks like something went wrong when trying to delete that user...",
        err
      );
      res.status(500).json(err);
    }
  },

  async addFriend(req, res) {
    try {
      const user = await User.findAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.body } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID found" });
      }

      res.json(user);
    } catch (err) {
      console.log(
        "Looks like something went wrong when trying to add that friend",
        err
      );
      res.status(500).json(err);
    }
  },

  async removeFriend(req, res) {
    try {
      const user = await User.findAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { runValidators: true, new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "No user with that ID found" });
      }

      res.json(user);
    } catch (err) {
      console.log(
        "Looks like something went wrong whey trying to remove that friend",
        err
      );
      res.status(500).json(err);
    }
  },
};
