const routes = require("express").Router();
const pool = require("./db");
const json2csv = require("json2csv");

// =============================================================EXPORT ROUTES=============================================================

// @Description: endpoint for exporting the product data to csv file
// @Request: GET
// @Endpoint: url/export/products
// @Returns: CSV File
routes.get("/products", async (req, res) => {
	try {
		// querying all the inventory details
		const products = await pool.query("SELECT * FROM products");
		// if there is no row in the inventory table, return
		if (products.rowCount == 0)
			return res.status(204).send("No Data in Product Database");
		// convert the json to csv format
		const csv = json2csv.parse(products.rows);
		// set header and attachment name for the file:
		res.header("Content-Type", "text/csv");
		res.attachment("Products.csv");
		// sending the file:
		return res.send(csv);
	} catch (error) {
		res.status(500).send({
			message: error.message,
		});
	}
});

// @Description: endpoint for exporting the inventory data to csv file
// @Request: GET
// @Endpoint: url/export/inventory
// @Returns: CSV File
routes.get("/inventory", async (req, res) => {
	try {
		// querying all the inventory details
		const inventories = await pool.query("SELECT * FROM inventory");
		// if there is no row in the inventory table, return
		if (inventories.rowCount == 0)
			return res.status(204).send("No Data in Inventory Database");
		// convert the json to csv format
		const csv = json2csv.parse(inventories.rows);
		// set header and attachment name for the file:
		res.header("Content-Type", "text/csv");
		res.attachment("Inventories.csv");
		// sending the file:
		return res.send(csv);
	} catch (error) {
		res.status(500).send({
			message: error.message,
		});
	}
});

module.exports = routes;
