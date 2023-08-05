const router = require("express").Router();
const {
  getPosts,
  getSinglePost,
  createPost,
  updatePost,
  deletePost,
  addReaction,
  removeReaction,
} = require("../../controllers/postController");

router.route("/").get(getPosts).post(createPost);

router.route("/:postId").get(getSinglePost).put(updatePost).delete(deletePost);

router.route("/:postId/reactions").post(addReaction);

router.route("/:postId/reactions/:reactionId").delete(removeReaction);

module.exports = router;
