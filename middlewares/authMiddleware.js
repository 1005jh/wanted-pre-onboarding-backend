require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const CustomError = require("../exception/exeption");

module.exports = (req, res, next) => {
  let accessToken = req.cookies["accessToken"];
  let isTokenFromHeader = true;

  if (!accessToken) {
    const { authorization } = req.headers;
    if (!authorization) {
      throw new CustomError(401, "로그인 후 이용 가능합니다.");
    }
    const [authType, authToken] = (authorization || "").split(" ");
    if (authType !== "Bearer" || !authToken) {
      throw new CustomError(401, "로그인 후 이용 가능합니다.");
    }
    accessToken = authToken;
    isTokenFromHeader = false;
  }
  if (!accessToken) {
    throw new CustomError(401, "로그인 후 이용 가능합니다.");
  }

  try {
    const { userId } = jwt.verify(accessToken, process.env.SECRET_KEY);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    throw new CustomError(401, "로그인 후 이용 가능합니다.");
  }
};
