const express = require("express");
const router = express.Router();
const authlogin = require("../middlewares/authLoginMiddleware");
const auth = require("../middlewares/authMiddleware");
const PostController = require("../controllers/posts.controller");
const postController = new PostController();

router.post("/", auth, postController.addPost);
router.get("/list", postController.list);
router.get("/:postId", postController.detail);
router.put("/:postId", auth, postController.update);
router.put("/:postId/status", auth, postController.delete);

module.exports = router;
