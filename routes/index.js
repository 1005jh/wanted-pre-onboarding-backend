const express = require("express");
const router = express.Router();

router.use("/users", require("./users.route"));
router.use("/posts", require("./posts.route"));
module.exports = router;
