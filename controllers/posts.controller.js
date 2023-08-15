const PostService = require("../services/posts.service");
const CustomError = require("../exception/exeption");

class PostController {
  postService = new PostService();

  addPost = async (req, res, next) => {
    try {
      const { title, content } = req.body;
      if (!title || !content) {
        throw new Error("needed title,content");
      }
      const { userId } = res.locals.user;
      const postData = {
        title: title,
        content: content,
        userId: userId,
      };
      const addPost = await this.postService.addPost(postData);

      res.status(201).send(addPost);
    } catch (error) {
      console.log(error, "add post error log");
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const { page } = req.query;
      if (!page) {
        throw new Error("needed page query");
      }
      const getAllList = await this.postService.list({ page });

      res.status(200).send(getAllList);
    } catch (error) {
      console.log(error, "getAllList error log");
      next(error);
    }
  };

  detail = async (req, res, next) => {
    try {
      const { postId } = req.params;
      if (!postId) {
        throw new Error("needed params");
      }
      const getDetailData = await this.postService.detail({ postId });

      res.status(200).send(getDetailData);
    } catch (error) {
      console.log(error, "get post data detail error log");
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { title, content } = req.body;
      const { userId } = res.locals.user;

      const updatePostData = {
        postId: postId,
        title: title,
        content: content,
        userId: userId,
      };
      const update = await this.postService.update(updatePostData);

      res.status(200).send(update);
    } catch (error) {
      console.log(error, "update post data error log");
      next(error);
    }
  };

  delete = async (req, res, next) => {
    try {
      const { postId } = req.params;
      const { userId } = res.locals.user;
      if (!postId) {
        throw new Error("needed params");
      }
      const deletePostData = {
        postId: postId,
        userId: userId,
      };
      const deletePost = await this.postService.delete(deletePostData);
      res.status(200).send(deletePost);
    } catch (error) {
      console.log(error, "delete post error log");
      next(error);
    }
  };
}

module.exports = PostController;
