const express = require("express");
const app = express();
const routes = require("./routes.js");
const exportRoutes = require("./exportRoutes.js");
const cors = require("cors");

app.use(
	cors({
		origin: "http://localhost:5500",
	})
);

app.use(express.json());
// used to recieve data as json objects from the client for the POST or PUT request.

app.use("/", routes);
app.use("/export", exportRoutes);
// Connects all routes to our application

// start listening to the port specified from the environment:
app.listen(process.env.PORT, () => {
	const url = "http://" + process.env.HOST + ":" + process.env.PORT;
	console.log("Server Started at port " + url);
});
