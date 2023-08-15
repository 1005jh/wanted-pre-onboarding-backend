const { Post, User } = require("../models");
const { Op } = require("sequelize");
const Sq = require("sequelize");
const Sequelize = Sq.Sequelize;

class PostRepository {
  addPost = async (postData) => {
    const addPost = await Post.create(postData);

    return await this.getPostData(addPost.postId);
  };

  getPostData = async (postId) => {
    const getPostData = await Post.findOne({ where: { postId: postId } });

    return getPostData;
  };

  list = async ({ offset }) => {
    const { count, rows } = await Post.findAndCountAll({
      where: { deleteStatus: "ISNOTDELETE" },
      offset: offset,
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
    return { count: count, rows: rows };
  };

  detail = async ({ postId }) => {
    const getDetailData = await Post.findOne({
      where: { postId: postId },
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

    return getDetailData;
  };

  update = async (updatePostData) => {
    await Post.update(
      { title: updatePostData.title, content: updatePostData.content },
      { where: { postId: updatePostData.postId } },
    );
    return this.getPostData(updatePostData.postId);
  };

  delete = async (deletePostData) => {
    await Post.update(
      { deleteStatus: "ISDELETE" },
      { where: { postId: deletePostData.postId } },
    );
    return this.getPostData(deletePostData.postId);
  };
}
module.exports = PostRepository;
