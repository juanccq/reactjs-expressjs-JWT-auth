const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/authentication");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
	res.send("Project started");
});

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

// app.use("/users", usersRouter);
app.use("/auth", authRouter);

app.listen(port, () => {
	console.log(`App running on ${port}`);
});
