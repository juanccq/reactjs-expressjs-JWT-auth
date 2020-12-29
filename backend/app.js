const express = require("express");
const app = express();
const { Sequelize } = require("sequelize");
const usersRouter = require("./routes/users");

require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Project started");
});

console.log("ip: " + process.env.DATABASE_HOST);

const sequelize = new Sequelize(
	process.env.DATABASE_NAME,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASS,
	{
		host: process.env.DATABASE_HOST,
		dialect: "mysql",
	}
);

const connectDb = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection successfully established");
	} catch (err) {
		console.log("Unable to connect to database: ", err);
	}
};

connectDb();

app.use("/users", usersRouter);

app.listen(port, () => {
	console.log(`App running on ${port}`);
});
