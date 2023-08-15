"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        targetKey: "userId",
      });
    }
  }
  Post.init(
    {
      postId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      userId: {
        allowNull: false,
        type: DataTypes.INTEGER,
        references: {
          model: "User",
          key: "userId",
        },
        onDelete: "cascade",
      },
      title: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      deleteStatus: {
        type: DataTypes.ENUM("ISDELETE", "ISNOTDELETE"),
        defaultValue: "ISNOTDELETE",
      },
    },
    {
      sequelize,
      modelName: "Post",
      timestamps: true,
    },
  );
  return Post;
};
