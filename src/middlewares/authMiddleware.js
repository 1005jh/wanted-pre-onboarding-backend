require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
  const authToken = req.cookies["access-token"];
  const refreshToken = req.cookies["refresh-token"];

  if (!authToken) {
    res.status(401).send({
      errorMessage: "로그인 후 이용 가능한 기능입니다.",
    });
    return;
  }

  try {
    const { userId } = jwt.verify(authToken, process.env.SECRET_KEY);
    User.findByPk(userId).then((user) => {
      res.locals.user = user;
      next();
    });
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      // accessToken 만료 시

      if (!refreshToken) {
        res.status(401).send({
          errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
        return;
      }

      // refreshToken 검증
      try {
        const { userId } = jwt.verify(
          refreshToken,
          process.env.REFRESH_SECRET_KEY,
        );

        // 새로운 accessToken 생성
        const newAccessToken = jwt.sign({ userId }, process.env.SECRET_KEY, {
          expiresIn: "1h", // 만료 시간 설정
        });

        // 새로운 accessToken을 응답 쿠키에 추가
        res.cookie("access-token", newAccessToken);

        User.findByPk(userId).then((user) => {
          res.locals.user = user;
          next();
        });
      } catch (err) {
        res.status(401).send({
          errorMessage: "로그인 후 이용 가능한 기능입니다.",
        });
      }
    } else {
      res.status(401).send({
        errorMessage: "로그인 후 이용 가능한 기능입니다.",
      });
    }
  }
};
