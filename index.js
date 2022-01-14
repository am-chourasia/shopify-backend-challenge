const express = require("express");
const app = express();

app.get("/", (req, res) => {
	res.send("Hello");
});
app.listen(process.env.PORT, () => {
	console.log(
		"Server Started at port https://" +
			process.env.HOST +
			":" +
			process.env.PORT
	);
});
