const UserService = require("../../services/users.service");
const UserRepository = require("../../repositories/users.repository");
const bcrypt = require("bcrypt");
jest.mock("bcrypt");
jest.mock("../../repositories/users.repository");

describe("UserService", () => {
  let userService;
  let userRepository;

  beforeEach(() => {
    userRepository = new UserRepository();
    userService = new UserService();
  });

  describe("signup", () => {
    it("should signup a new user", async () => {
      const mockUser = {
        email: "test@test.com",
        nickname: "testUser",
        password: "testPassword",
      };

      UserRepository.prototype.userInfo = jest.fn().mockResolvedValue(null);
      UserRepository.prototype.createUser = jest
        .fn()
        .mockResolvedValue(mockUser);

      const result = await userService.signup(mockUser);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
    });

    it("should throw an error if email already exists", async () => {
      const mockUser = {
        email: "existing@test.com",
        nickname: "existingUser",
        password: "testPassword",
      };

      UserRepository.prototype.userInfo = jest.fn().mockResolvedValue(mockUser);
      await expect(userService.signup(mockUser)).rejects.toThrowError(
        "이미 존재하는 이메일입니다.",
      );
    });
  });

  describe("login", () => {
    it("should login a user with correct credentials", async () => {
      const mockUser = {
        userId: 1,
        email: "test@test.com",
        nickname: "testUser",
        password: await bcrypt.hash("testPassword", 12),
      };

      UserRepository.prototype.getUserByEmail = jest
        .fn()
        .mockResolvedValue(mockUser);

      bcrypt.compare.mockResolvedValueOnce(true);

      const result = await userService.login({
        email: "test@test.com",
        password: "testPassword",
      });

      expect(result).toBeTruthy();
    });

    it("should throw an error if user does not exist", async () => {
      userRepository.getUserByEmail.mockResolvedValue(null);

      await expect(
        userService.login({
          email: "nonexistent@test.com",
          password: "testPassword",
        }),
      ).rejects.toThrowError("아이디와 비밀번호를 확인해주세요");
    });

    it("should throw an error if password is incorrect", async () => {
      const mockUser = {
        userId: 1,
        email: "test@test.com",
        nickname: "testUser",
        password: await bcrypt.hash("testPassword", 12),
      };

      UserRepository.prototype.getUserByEmail = jest
        .fn()
        .mockResolvedValue(mockUser);

      bcrypt.compare.mockResolvedValueOnce(false);
      await expect(
        userService.login({
          email: "test@test.com",
          password: "wrongPassword",
        }),
      ).rejects.toThrowError("아이디와 비밀번호를 확인해주세요");
    });
  });
});
