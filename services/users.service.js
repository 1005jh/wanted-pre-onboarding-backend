const UserRepository = require("../repositories/users.repository");
require("dotenv").config();
const CustomError = require("../exception/exeption");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

class UserService {
  userRepository = new UserRepository();

  signup = async (users) => {
    const existEmail = await this.userRepository.userInfo(users.email);
    console.log(existEmail, "이거 값뭐예요?");
    if (existEmail) {
      throw new CustomError(400, "이미 존재하는 이메일입니다.");
    }
    const hashed = await bcrypt.hash(users.password, 12);
    users.password = hashed;
    const createUser = await this.userRepository.createUser(users);

    return {
      success: true,
      data: createUser,
    };
  };

  login = async (userData) => {
    const existUser = await this.userRepository.getUserByEmail(userData.email);
    if (!existUser) {
      throw new CustomError(400, "아이디와 비밀번호를 확인해주세요");
    }
    const isValidatePassword = await bcrypt.compare(
      userData.password,
      existUser.password,
    );
    if (!isValidatePassword) {
      throw new CustomError(400, "아이디와 비밀번호를 확인해주세요");
    }
    const accessToken = jwt.sign(
      {
        userId: existUser.userId,
        email: existUser.email,
        nickname: existUser.nickname,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" },
    );
    return accessToken;
  };
}

module.exports = UserService;
