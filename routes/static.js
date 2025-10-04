const express = require('express');
const router = express.Router();
const baseController = require('../controllers/baseController');

router.use(express.static("public"));
router.use("/css", express.static(__dirname + "public/css"));
router.use("/js", express.static(__dirname + "public/js"));
router.use("/images", express.static(__dirname + "public/images"));

router.get('/trigger-error', baseController.myErrorFunction);


module.exports = router;