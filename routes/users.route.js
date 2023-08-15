const express = require("express");
const router = express.Router();
const authlogin = require("../middlewares/authLoginMiddleware");
const auth = require("../middlewares/authMiddleware");
const UserController = require("../controllers/users.controller");
const userController = new UserController();

router.post("/signup", authlogin, userController.signup);
router.post("/login", authlogin, userController.login);

module.exports = router;
