const ctrl = {};
const Models = require("../models/index");
const sidebar = require("../helpers/sidebar");

ctrl.index = async (req, res) => {
  const images = await Models.Image.find().sort({ timestamp: -1 }).lean();
  let viewModel = { images: [] };
  viewModel.images = images;
  viewModel = await sidebar(viewModel);
  res.render("index", viewModel);
};

module.exports = ctrl;
