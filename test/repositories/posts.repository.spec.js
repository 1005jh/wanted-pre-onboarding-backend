const { Post, User } = require("../../models");
const { Op, Sequelize } = require("sequelize");
const PostRepository = require("../../repositories/posts.repository");

jest.mock("../../models");

describe("PostRepository", () => {
  let postRepository;

  beforeEach(() => {
    postRepository = new PostRepository();
  });

  describe("addPost", () => {
    it("should add a new post and return post data", async () => {
      const mockPostData = {
        title: "Test Post",
        content: "Test content",
        userId: 1,
      };
      const mockCreatedPost = { ...mockPostData, postId: 1 };

      Post.create.mockResolvedValue(mockCreatedPost);
      postRepository.getPostData = jest.fn().mockResolvedValue(mockCreatedPost);

      const result = await postRepository.addPost(mockPostData);

      expect(Post.create).toHaveBeenCalledWith(mockPostData);
      expect(postRepository.getPostData).toHaveBeenCalledWith(
        mockCreatedPost.postId,
      );
      expect(result).toEqual(mockCreatedPost);
    });
  });

  describe("getPostData", () => {
    it("should retrieve post data based on postId", async () => {
      const mockPostId = 1;
      const mockPostData = {
        postId: mockPostId,
        title: "Test Post",
        content: "Test content",
      };

      Post.findOne.mockResolvedValue(mockPostData);

      const result = await postRepository.getPostData(mockPostId);

      expect(Post.findOne).toHaveBeenCalledWith({
        where: { postId: mockPostId },
      });
      expect(result).toEqual(mockPostData);
    });
  });

  describe("list", () => {
    it("should retrieve a list of posts", async () => {
      const mockOffset = 0;
      const mockPostList = [
        { postId: 1, title: "Post 1" },
        { postId: 2, title: "Post 2" },
      ];

      Post.findAndCountAll.mockResolvedValue({
        rows: mockPostList,
        count: mockPostList.length,
      });

      const result = await postRepository.list({ offset: mockOffset });

      expect(Post.findAndCountAll).toHaveBeenCalledWith({
        where: { deleteStatus: "ISNOTDELETE" },
        offset: mockOffset,
        limit: 15,
        attributes: [
          "postId",
          "title",
          "content",
          "deleteStatus",
          [Sequelize.col("User.userId"), "userId"],
          [Sequelize.col("User.nickname"), "nickname"],
        ],
        include: { model: User, attributes: [] },
        order: [["createdAt", "DESC"]],
        raw: true,
      });
      expect(result).toEqual({
        count: mockPostList.length,
        rows: mockPostList,
      });
    });
  });

  describe("detail", () => {
    it("should retrieve details of a post", async () => {
      const mockPostId = 1;
      const mockDetailData = { postId: mockPostId, title: "Post Detail" };
      Post.findOne.mockResolvedValue(mockDetailData);

      const result = await postRepository.detail({ postId: mockPostId });

      expect(Post.findOne).toHaveBeenCalledWith({
        where: { postId: mockPostId },
        attributes: [
          "postId",
          "title",
          "content",
          "deleteStatus",
          [Sequelize.col("User.userId"), "userId"],
          [Sequelize.col("User.nickname"), "nickname"],
        ],
        include: { model: User, attributes: [] },
      });
      expect(result).toEqual(mockDetailData);
    });

    it("should return null if post does not exist", async () => {
      const mockPostId = 1;
      Post.findOne.mockResolvedValue(null);

      const result = await postRepository.detail({ postId: mockPostId });

      expect(Post.findOne).toHaveBeenCalledWith({
        where: { postId: mockPostId },
        attributes: [
          "postId",
          "title",
          "content",
          "deleteStatus",
          [Sequelize.col("User.userId"), "userId"],
          [Sequelize.col("User.nickname"), "nickname"],
        ],
        include: { model: User, attributes: [] },
      });
      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const mockUpdatePostData = {
        postId: 1,
        userId: 2,
        title: "Updated Post Title",
        content: "Updated content",
      };
      postRepository.getPostData = jest
        .fn()
        .mockResolvedValue(mockUpdatePostData);
      Post.update.mockResolvedValue(1);

      const result = await postRepository.update(mockUpdatePostData);

      expect(Post.update).toHaveBeenCalledWith(
        {
          title: mockUpdatePostData.title,
          content: mockUpdatePostData.content,
        },
        { where: { postId: mockUpdatePostData.postId } },
      );
      expect(postRepository.getPostData).toHaveBeenCalledWith(
        mockUpdatePostData.postId,
      );
      expect(result).toEqual(expect.objectContaining(mockUpdatePostData));
    });
  });
  describe("delete", () => {
    it("should mark the post as deleted", async () => {
      const mockDeletePostData = { postId: 1 };
      const mockDeletedPostData = {
        postId: mockDeletePostData.postId,
        deleteStatus: "ISDELETE",
        title: "Post Title",
        content: "Post content",
      };

      Post.update.mockResolvedValue([1]);
      postRepository.getPostData = jest
        .fn()
        .mockResolvedValue(mockDeletedPostData);

      const result = await postRepository.delete(mockDeletePostData);

      expect(Post.update).toHaveBeenCalledWith(
        { deleteStatus: "ISDELETE" },
        { where: { postId: mockDeletePostData.postId } },
      );
      expect(postRepository.getPostData).toHaveBeenCalledWith(
        mockDeletePostData.postId,
      );
      expect(result).toEqual(mockDeletedPostData);
    });

    it("should return updated post data after marking as deleted", async () => {
      const mockDeletePostData = { postId: 1 };
      const mockPostDataAfterDelete = {
        postId: mockDeletePostData.postId,
        deleteStatus: "ISDELETE",
      };

      postRepository.getPostData = jest
        .fn()
        .mockResolvedValue(mockPostDataAfterDelete);
      Post.update.mockResolvedValue([1]);

      const result = await postRepository.delete(mockDeletePostData);

      expect(result.deleteStatus).toEqual("ISDELETE");
    });
  });
});
