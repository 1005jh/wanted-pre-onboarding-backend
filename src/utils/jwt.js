const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const UserRepository = require("../repositories/users.repository");
dotenv.config();
class jwtT {
  userRepository = new UserRepository();
  createUser = async (email, nickname, password) => {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error("가입하신 회원이 아닙니다.");
    }
    const accessToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
      },
      process.env.SECRET_KEY,
      { expiresIn: "7d" },
    );
    const refreshToken = jwt.sign(
      {
        userId: user.userId,
        email: user.email,
        nickname: user.nickname,
      },
      process.env.SECRET_KEY,
      { expiresIn: "14d" },
    );
    await this.userRepository.refreshT(user, refreshToken);

    return { user, accessToken, refreshToken };
  };
}
module.exports = jwtT;
