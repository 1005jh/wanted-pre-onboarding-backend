require("dotenv").config();
const CustomError = require("../exception/exeption");

module.exports = (req, res, next) => {
  try {
    const { accessToken } = req.cookies;
    const { authorization } = req.headers;

    const [authType, authToken] = (authorization || "").split(" ");
    if (authType === "Bearer" || authToken) {
      throw new CustomError(403, "이미 로그인이 되어있습니다.");
    }

    if (accessToken) {
      return res.status(403).send({
        errorMessage: "이미 로그인이 되어있습니다.",
      });
    }

    next();
  } catch (error) {
    console.trace(error);
    return res.status(400).send({
      errorMessage: "잘못된 접근입니다.",
    });
  }
};
