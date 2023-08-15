const PostService = require("../../services/posts.service");
const PostRepository = require("../../repositories/posts.repository");
const CustomError = require("../../exception/exeption");

jest.mock("../../repositories/posts.repository");

describe("PostService", () => {
  let postService;
  let postRepository;

  beforeEach(() => {
    postRepository = new PostRepository();
    postService = new PostService();
  });

  describe("addPost", () => {
    it("should add a new post", async () => {
      const mockPostData = {
        title: "Test Post",
        content: "Test content",
        userId: 1,
      };
      PostRepository.prototype.addPost = jest
        .fn()
        .mockResolvedValue(mockPostData);

      const result = await postService.addPost(mockPostData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPostData);
    });
  });

  describe("list", () => {
    it("should retrieve a list of posts", async () => {
      const mockPage = 1;
      const mockPostList = [
        { id: 1, title: "Post 1" },
        { id: 2, title: "Post 2" },
      ];

      PostRepository.prototype.list = jest.fn().mockResolvedValue({
        rows: mockPostList,
        count: mockPostList.length,
      });

      const result = await postService.list({ page: mockPage });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockPostList);
      expect(result.count).toBe(mockPostList.length);
    });
  });

  describe("detail", () => {
    it("should retrieve details of a post", async () => {
      const mockPostId = 1;
      const mockDetailData = { id: mockPostId, title: "Post Detail" };
      PostRepository.prototype.detail = jest
        .fn()
        .mockResolvedValue(mockDetailData);

      const result = await postService.detail({ postId: mockPostId });

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDetailData);
    });

    it("should throw an error if post is deleted", async () => {
      const mockPostId = 1;

      PostRepository.prototype.detail = jest.fn().mockResolvedValue({
        id: mockPostId,
        deleteStatus: "ISDELETE",
      });

      await expect(
        postService.detail({ postId: mockPostId }),
      ).rejects.toThrowError("삭제된 게시물입니다.");
    });
  });

  describe("update", () => {
    it("should update a post", async () => {
      const mockUpdatePostData = {
        postId: 1,
        userId: 1,
        title: "Updated Post Title",
        content: "Updated content",
      };

      const mockUpdatedPost = { ...mockUpdatePostData };
      PostRepository.prototype.getPostData = jest
        .fn()
        .mockResolvedValue({ userId: 1 });
      PostRepository.prototype.update = jest
        .fn()
        .mockResolvedValue(mockUpdatedPost);

      const result = await postService.update(mockUpdatePostData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUpdatedPost);
    });

    it("should throw an error if user does not have permission to update", async () => {
      const mockUpdatePostData = {
        postId: 1,
        userId: 2,
        title: "Updated Post Title",
        content: "Updated content",
      };

      PostRepository.prototype.getPostData = jest
        .fn()
        .mockResolvedValue({ userId: 1 });

      await expect(postService.update(mockUpdatePostData)).rejects.toThrowError(
        "게시글 수정 권한이 없습니다.",
      );
    });
  });

  describe("delete", () => {
    it("should delete a post", async () => {
      const mockDeletePostData = {
        postId: 1,
        userId: 1,
      };

      const mockDeleteResult = { success: true };
      PostRepository.prototype.getPostData = jest
        .fn()
        .mockResolvedValue({ userId: 1 });
      PostRepository.prototype.delete = jest
        .fn()
        .mockResolvedValue(mockDeleteResult);

      const result = await postService.delete(mockDeletePostData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockDeleteResult);
    });

    it("should throw an error if user does not have permission to delete", async () => {
      const mockDeletePostData = {
        postId: 1,
        userId: 2,
      };

      PostRepository.prototype.getPostData = jest
        .fn()
        .mockResolvedValue({ userId: 1 });

      await expect(postService.delete(mockDeletePostData)).rejects.toThrowError(
        "삭제 권한이 없습니다.",
      );
    });

    it("should throw an error if post is already deleted", async () => {
      const mockDeletePostData = {
        postId: 1,
        userId: 1,
      };

      PostRepository.prototype.getPostData = jest
        .fn()
        .mockResolvedValue({ userId: 1, deleteStatus: "ISDELETE" });

      await expect(postService.delete(mockDeletePostData)).rejects.toThrowError(
        "이미 삭제된 게시글입니다.",
      );
    });
  });
});
