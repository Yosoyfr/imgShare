const { Image, Comment } = require("../models");

async function imageCounter() {
  return await Image.countDocuments();
}

async function commentCounter() {
  return await Comment.countDocuments();
}

async function imageTotalViewsCounter() {
  const result = await Image.aggregate([
    {
      $group: {
        _id: "1",
        viewsTotal: { $sum: "$views" },
      },
    },
  ]);
  return result[0].viewsTotal;
}

async function likesTotalCounter() {
  const result = await Image.aggregate([
    {
      $group: {
        _id: "1",
        likesTotal: { $sum: "$likes" },
      },
    },
  ]);
  return result[0].likesTotal;
}

module.exports = async () => {
  const results = await Promise.all([
    imageCounter(),
    imageTotalViewsCounter(),
    commentCounter(),
    likesTotalCounter(),
  ]);
  return {
    images: results[0],
    comments: results[2],
    views: results[1],
    likes: results[3],
  };
};
