const express = require("express");

const {
  addFeatureImage,
  getFeatureImages,
  removeFeatureImage
} = require("../../controllers/common/feature-controller");

const router = express.Router();

router.post("/add", addFeatureImage);
router.delete("/remove/:id", removeFeatureImage);
router.get("/get", getFeatureImages);

module.exports = router;
