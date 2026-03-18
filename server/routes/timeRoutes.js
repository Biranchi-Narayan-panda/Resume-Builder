const express = require("express");
const router = express.Router();
const { getTimeStatus } = require("../controllers/timeController");

router.get("/", getTimeStatus);

module.exports = router;
