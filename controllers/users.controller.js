const UserService = require("../services/users.service");
const CustomError = require("../exception/exeption");
const bcrypt = require("bcrypt");
const Joi = require("../utils/joi");

class UserController {
  userService = new UserService();

  signup = async (req, res, next) => {
    try {
      const { email, nickname, password } = req.body;
      await Joi.signupSchema.validateAsync(req.body);

      if (!email || !nickname || !password) {
        throw new CustomError(400, "모든 항목을 기입해주세요.");
      } else if (nickname.includes(password) || password.includes(nickname)) {
        throw new CustomError(400, "닉네임과 비밀번호는 다르게 설정해주세요.");
      }
      const users = {
        email: email,
        nickname: nickname,
        password: password,
      };
      const signup = await this.userService.signup(users);

      return res.status(201).send(signup);
    } catch (error) {
      console.log(error, "user signup error log");
      next(error);
    }
  };

  login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      await Joi.loginSchema.validateAsync(req.body);

      if (!email || !password) {
        throw new CustomError(400, "모든 항목을 기입해주세요");
      }
      const userData = {
        email: email,
        password: password,
      };
      const token = await this.userService.login(userData);
      res.setHeader("Authorization", "Bearer " + token);
      res.cookie("accessToken", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000, //1d
      });
      return res.status(200).send({ success: true, token: token });
    } catch (error) {
      console.log(error, "user login error log");
      next(error);
    }
  };
}

module.exports = UserController;
