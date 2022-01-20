const express = require("express");
const app = express();
const routes = require("./routes.js");
const exportRoutes = require("./exportRoutes.js");

app.use(express.json());
// used to recieve data as json objects from the client for the POST or PUT request.

app.use("/api", routes);
app.use("/api/export", exportRoutes);
// Connects all routes to our application

app.get("/", (req, res) => {
	res.sendFile("index.html", { root: __dirname });
});
// to send the HTML file at the home page

// start listening to the port specified from the environment:
app.listen(process.env.PORT, () => {
	const url = "http://" + process.env.HOST + ":" + process.env.PORT;
	console.log("Server Started at port " + url);
});
