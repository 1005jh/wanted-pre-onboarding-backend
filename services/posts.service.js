const PostRepository = require("../repositories/posts.repository");
require("dotenv").config();
const CustomError = require("../exception/exeption");

class PostService {
  postRepository = new PostRepository();

  addPost = async (postData) => {
    const addPost = await this.postRepository.addPost(postData);

    return {
      success: true,
      data: addPost,
    };
  };

  list = async ({ page }) => {
    const offset = (parseInt(page) - 1) * 15;
    const getAllList = await this.postRepository.list({ offset });

    return {
      success: true,
      data: getAllList.rows,
      count: getAllList.count,
    };
  };

  detail = async ({ postId }) => {
    const getDetailData = await this.postRepository.detail({ postId });
    if (getDetailData.deleteStatus === "ISDELETE") {
      throw new CustomError(400, "삭제된 게시물입니다.");
    }

    return {
      success: true,
      data: getDetailData,
    };
  };

  update = async (updatePostData) => {
    // 1. 내가 만든 게시글
    const isUserPost = await this.postRepository.getPostData(
      updatePostData.postId,
    );
    if (updatePostData.userId !== isUserPost.userId) {
      throw new CustomError(400, "게시글 수정 권한이 없습니다.");
    }
    // 2. 데이터 저장
    const updatePost = await this.postRepository.update(updatePostData);

    return {
      success: true,
      data: updatePost,
    };
  };

  delete = async (deletePostData) => {
    // 1. 내가 만든 게시글인지 확인
    const isUserPost = await this.postRepository.getPostData(
      deletePostData.postId,
    );
    if (deletePostData.userId !== isUserPost.userId) {
      throw new CustomError(400, "삭제 권한이 없습니다.");
    } else if (isUserPost.deleteStatus === "ISDELETE") {
      // 2. deleteStatus = 'ISDELETE' 여부 확인
      throw new CustomError(400, "이미 삭제된 게시글입니다.");
    }
    // 3. deleteStatus = 'ISDELETE' 업데이트
    const deletePost = await this.postRepository.delete(deletePostData);

    return {
      success: true,
      data: deletePost,
    };
  };
}

module.exports = PostService;
