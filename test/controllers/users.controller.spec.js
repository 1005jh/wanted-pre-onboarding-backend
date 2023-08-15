const UserController = require("../../controllers/users.controller");
const UserService = require("../../services/users.service");
const Joi = require("../../utils/joi");

jest.mock("../../services/users.service");

describe("UserController", () => {
  let userController;
  let req, res, next;
  let mockSignupData, mockToken;

  beforeEach(() => {
    userController = new UserController();
    req = { body: null };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      json: jest.fn(),
      cookie: jest.fn(),
      setHeader: jest.fn(),
    };
    next = jest.fn();

    mockSignupData = {
      success: true,
      data: "newUser",
    };
    mockToken = "mockAccessToken";

    Joi.signupSchema.validateAsync = jest.fn().mockResolvedValue({});
    Joi.loginSchema.validateAsync = jest.fn().mockResolvedValue({});
  });

  describe("signup", () => {
    it("should signup a new user", async () => {
      UserService.prototype.signup = jest
        .fn()
        .mockResolvedValue(mockSignupData);

      req.body = {
        email: "test@test.com",
        nickname: "testUser",
        password: "testPassword",
      };

      await userController.signup(req, res, next);

      expect(UserService.prototype.signup).toHaveBeenCalledWith({
        email: "test@test.com",
        nickname: "testUser",
        password: "testPassword",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockSignupData);
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with an error if validation throws an error", async () => {
      req.body = {
        email: "test@@example.com",
        password: "test",
      };

      await userController.signup(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("login", () => {
    it("should login a user", async () => {
      UserService.prototype.login = jest.fn().mockResolvedValue(mockToken);

      req.body = {
        email: "test@test.com",
        password: "testPassword",
      };

      await userController.login(req, res, next);

      expect(UserService.prototype.login).toHaveBeenCalledWith({
        email: "test@test.com",
        password: "testPassword",
      });
      expect(res.setHeader).toHaveBeenCalledWith(
        "Authorization",
        "Bearer " + mockToken,
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "accessToken",
        mockToken,
        expect.any(Object),
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        token: mockToken,
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should call next with an error if validation throws an error", async () => {
      req.body = {
        email: "test@@example.com",
        password: "test",
      };
      Joi.loginSchema.validateAsync.mockRejectedValue(
        new Error("Validation Error"),
      );
      await userController.login(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
