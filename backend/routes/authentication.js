"use strict";

const router = require("express").Router();
const authController = require("../controllers/authController");

router.route("/register").post(authController.register);

router.route("/login").post((req, res) => {
	res.json("login route");
});

module.exports = router;
