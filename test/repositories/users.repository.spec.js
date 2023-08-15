const { User } = require("../../models");
const UserRepository = require("../../repositories/users.repository");

describe("UserRepository", () => {
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
  });

  describe("createUser", () => {
    it("should create a new user and return user info", async () => {
      User.create = jest.fn();

      const mockUser = {
        email: "test@test.com",
        nickname: "testUser",
        password: "testPassword",
      };

      const expectedUserInfo = {
        email: mockUser.email,
        nickname: mockUser.nickname,
      };

      userRepository.userInfo = jest.fn().mockResolvedValue(expectedUserInfo);

      const result = await userRepository.createUser(mockUser);

      expect(User.create).toHaveBeenCalledWith({
        email: mockUser.email,
        password: mockUser.password,
        nickname: mockUser.nickname,
      });
      expect(userRepository.userInfo).toHaveBeenCalledWith(mockUser.email);
      expect(result).toEqual(expectedUserInfo);
    });
  });

  describe("userInfo", () => {
    it("should return user info based on email", async () => {
      const mockUser = {
        email: "test@test.com",
        nickname: "testUser",
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userRepository.userInfo(mockUser.email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
        attributes: ["email", "nickname"],
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("getUserByEmail", () => {
    it("should return user info based on email", async () => {
      const mockUser = {
        email: "test@test.com",
        nickname: "testUser",
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await userRepository.getUserByEmail(mockUser.email);

      expect(User.findOne).toHaveBeenCalledWith({
        where: { email: mockUser.email },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
