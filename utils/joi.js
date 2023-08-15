const Joi = require("joi");

module.exports = {
  signupSchema: Joi.object({
    email: Joi.string()
      .regex(/@/)
      .message('문자 "@"를 포함해주세요.')
      .required(),
    nickname: Joi.string()
      .min(2)
      .max(10)
      .error(new Error("닉네임은 2자 이상 10자 이하로 해주세요.")),
    password: Joi.string()
      .min(8)
      .required()
      .error(new Error("비밀번호는 8자 이상으로 해주세요.")),
  }),

  loginSchema: Joi.object({
    email: Joi.string()
      .regex(/@/)
      .message('문자 "@"를 포함해주세요.')
      .required(),
    password: Joi.string()
      .min(8)
      .required()
      .error(new Error("비밀번호는 8자 이상으로 해주세요.")),
  }),
};
