const db = require("../models/index");
const User = db.User;
const bcrypt = require("bcrypt");
const saltRound = 10;
const nodemailer = require("nodemailer");

const authController = {
	async register(req, res) {
		let transporter = getMailTransporter();

		try {
			let hashedPassword = await bcrypt
				.hash(req.body.password, saltRound)
				.then((hashed) => {
					return hashed;
				});

			let createdData = await User.create({
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				email: req.body.email,
				password: hashedPassword,
			}).then((data) => {
				delete data.dataValues.password;
				return data;
			});

			// Send email
			let info = await transporter
				.sendMail({
					from: process.env.SMTP_SENDER,
					to: req.body.email,
					subject: "Please confirm the registration",
					text: "Please confirm",
					html: getEmailHTMLContent(req.body.firstName),
				})
				.then((data) => {
					res.status(200).json({
						data: createdData,
						emailMessageID: data.messageId,
					});
				});
		} catch (err) {
			res.status(400).json(err);
		}
	},
};

/**
 * Return mail transporter object
 */
const getMailTransporter = () => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: parseInt(process.env.SMTP_SECURE),
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
	});

	return transporter;
};

const getEmailHTMLContent = (name) => {
	return `
	<html>
	<head>
	<style>
		* {
			font-family: Arial, Helvetica;
		}
	</style>
	</head>
	<body>
	<h2>Hi: ${name},</h2>
	<p>Please confirm your registration following this link<p>
	<p>If you don't make any registration please ignore this email.</p>
	</body>
	</html>`;
};

module.exports = authController;
