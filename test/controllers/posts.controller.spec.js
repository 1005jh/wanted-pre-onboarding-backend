const PostController = require("../../controllers/posts.controller");
const PostService = require("../../services/posts.service");
const authMiddleware = require("../../middlewares/authMiddleware");

jest.mock("../../services/posts.service");

describe("PostController", () => {
  let postController;
  let req, res, next;
  let mockPostData, mockPostList;

  beforeEach(() => {
    postController = new PostController();
    req = { body: null, params: null, query: null, cookies: {}, headers: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      locals: { user: { userId: 1 } },
    };
    next = jest.fn();

    mockToken = "mockAccessToken";
    mockPostData = {
      title: "Test Post",
      content: "This is a test post.",
      userId: 1,
    };

    mockPostList = [
      { id: 1, title: "Post 1" },
      { id: 2, title: "Post 2" },
    ];

    PostService.prototype.addPost = jest.fn();
    PostService.prototype.list = jest.fn();
    PostService.prototype.detail = jest.fn();
    PostService.prototype.update = jest.fn();
    PostService.prototype.delete = jest.fn();
  });

  describe("addPost", () => {
    it("should add a new post", async () => {
      req.body = mockPostData;
      PostService.prototype.addPost.mockResolvedValue(mockPostData);

      await postController.addPost(req, res, next);

      expect(PostService.prototype.addPost).toHaveBeenCalledWith(mockPostData);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(mockPostData);
    });

    it("should call next with an error if required data is missing", async () => {
      req.body = {};

      await postController.addPost(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("list", () => {
    it("should retrieve a list of posts", async () => {
      req.query = { page: 1 };

      PostService.prototype.list.mockResolvedValue(mockPostList);

      await postController.list(req, res, next);

      expect(PostService.prototype.list).toHaveBeenCalledWith({ page: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockPostList);
    });

    it("should call next with an error if required query parameter is missing", async () => {
      req.query = {};

      await postController.list(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("detail", () => {
    it("should retrieve details of a post", async () => {
      req.params = { postId: 1 };

      const mockDetailData = { id: 1, title: "Post 1 Detail" };

      PostService.prototype.detail.mockResolvedValue(mockDetailData);

      await postController.detail(req, res, next);

      expect(PostService.prototype.detail).toHaveBeenCalledWith({ postId: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockDetailData);
    });

    it("should call next with an error if postId parameter is missing", async () => {
      req.params = {};

      await postController.detail(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      req.params = { postId: 1 };
      req.body = { title: "Updated Post", content: "Updated content" };

      const mockUpdatedPost = {
        id: 1,
        title: "Updated Post",
        content: "Updated content",
      };

      PostService.prototype.update.mockResolvedValue(mockUpdatedPost);

      await postController.update(req, res, next);

      expect(PostService.prototype.update).toHaveBeenCalledWith({
        postId: 1,
        title: "Updated Post",
        content: "Updated content",
        userId: res.locals.user.userId,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockUpdatedPost);
    });

    it("should call next with an error if postId parameter is missing", async () => {
      req.params = {};

      await postController.update(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });

  describe("delete", () => {
    it("should delete a post", async () => {
      req.params = { postId: 1 };

      const mockDeleteResult = { success: true };

      PostService.prototype.delete.mockResolvedValue(mockDeleteResult);

      await postController.delete(req, res, next);

      expect(PostService.prototype.delete).toHaveBeenCalledWith({
        postId: 1,
        userId: res.locals.user.userId,
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(mockDeleteResult);
    });

    it("should call next with an error if postId parameter is missing", async () => {
      req.params = {};

      await postController.delete(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
    });
  });
});
