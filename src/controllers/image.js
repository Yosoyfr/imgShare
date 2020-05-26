const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
const Models = require("../models/index");
const md5 = require("md5");
const { resolveSoa } = require("dns");
const sidebar = require("../helpers/sidebar");
const ctrl = {};

ctrl.index = async (req, res) => {
  let viewModel = { image: {}, comments: {} };
  let image = await Models.Image.findById(req.params.image_id);
  if (image) {
    image.views++;
    await image.save();
    image = await Models.Image.findById(req.params.image_id).lean();
    viewModel.image = image;
    const comments = await Models.Comment.find({
      image_id: image._id,
    }).lean();
    viewModel.comments = comments;
    viewModel = await sidebar(viewModel);
    res.render("image", viewModel);
  } else {
    res.redirect("/");
  }
};

ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Models.Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
      return;
    }
    const imgPath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();
    const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);
    if (ext.match(/.png|.jpg|.jpeg|.gif/)) {
      await fs.rename(imgPath, targetPath);
      const newImg = new Models.Image({
        title: req.body.title,
        description: req.body.description,
        filename: imgUrl + ext,
      });
      const imageSaved = await newImg.save();
      res.redirect("/images/" + imageSaved._id);
    } else {
      await fs.unlink(imgPath);
      res.status(500).json({ error: "Only Images are Allowed" });
    }
  };
  saveImage();
};

ctrl.like = async (req, res) => {
  const image = await Models.Image.findById(req.params.image_id);
  if (image) {
    image.likes++;
    await image.save();
    res.json({ likes: image.likes });
  } else {
    res.status(500).json({ error: "Internal Error" });
  }
};

ctrl.comment = async (req, res) => {
  const image = await Models.Image.findById(req.params.image_id).lean();
  if (image) {
    const newComment = new Models.Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    newComment.save();
    res.redirect("/images/" + image._id);
  } else {
    res.redirect("/");
  }
};

ctrl.remove = async (req, res) => {
  const image = await Models.Image.findById(req.params.image_id);
  if (image) {
    await fs.unlink(path.resolve("./src/public/upload/" + image.filename));
    await Models.Comment.deleteOne({ _id: image._id });
    await image.remove();
    res.json(true);
  }
};

module.exports = ctrl;
