const express = require("express");
const { UserModel, TodoModel } = require("./db");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "aditya0606;";
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

app.post("/signup", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	const name = req.body.name;

	try {
		await UserModel.create({
			email: email,
			password: password,
			name: name,
		});
		res.json({
			message: "You are signed in",
		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			message: "internal server error ",
		});
	}
});
app.post("/signin", async (req, res) => {
	const email = req.body.email;
	const password = req.body.password;

	const user = await UserModel.findOne({
		email,
		password,
	});

	if (user) {
		const token = jwt.sign(
			{
				id: user._id.toString(),
			},
			JWT_SECRET
		);
		res.json({
			token: token,
			userID: user._id,
		});
	} else {
		res.status(403).json({
			message: "Incorrect credentials",
		});
	}
});
app.post("/todo", auth, async (req, res) => {
	const userId = req.userId;
	const title = req.body.title;
	await TodoModel.create({
		userId,
		title,
	});

	res.json({
		message: "todo created",
	});
});
app.get("/todos", auth, async (req, res) => {
	const userId = req.userId;
	const todos = await TodoModel.find({
		userId,
	});
	res.json({
		todos,
	});
});

function auth(req, res, next) {
	const token = req.headers.token;
	const decodedData = jwt.verify(token, JWT_SECRET);
	if (decodedData) {
		req.userId = decodedData.id;
		next();
	} else {
		res.status(403).json({
			message: "incorrect credentials",
		});
	}
}

(async () => {
	try {
		await mongoose.connect(
			"mongodb+srv://aditya:UGd47vKr6tFMcVa2@cluster0.yketk.mongodb.net/todo-aditya-0606"
		);
		console.log("database connected succesfully");
		app.listen(3000);
		console.log("server started at http://localhost:3000");
	} catch (err) {
		console.log("error starting server", err);
	}
})();
