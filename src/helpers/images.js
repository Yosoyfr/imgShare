const { Image } = require("../models");

module.exports = {
  async popular() {
    const images = Image.find().limit(9).sort({ likes: -1 }).lean();
    return images;
  },
};
