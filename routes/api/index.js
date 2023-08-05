const router = require("express").Router();
const userRoutes = require("./userRoutes");
const postRoutes = require("./postRoutes");

router.use("/posts", postRoutes);
router.use("/users", userRoutes);

module.exports = router;
