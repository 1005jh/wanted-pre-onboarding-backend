const { User } = require("../models");

class UserRepository {
  createUser = async (users) => {
    await User.create({
      email: users.email,
      password: users.password,
      nickname: users.nickname,
    });

    return await this.userInfo(users.email);
  };

  userInfo = async (email) => {
    const userInfo = await User.findOne({
      where: { email: email },
      attributes: ["email", "nickname"],
    });

    return userInfo;
  };

  getUserByEmail = async (email) => {
    const userInfo = await User.findOne({ where: { email: email } });

    return userInfo;
  };
}

module.exports = UserRepository;
