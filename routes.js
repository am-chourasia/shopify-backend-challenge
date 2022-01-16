const routes = require("express").Router();
const pool = require("./db");

// @Description: add a new Product in the products table which also reflects in the inventory table:
// @Request: POST
// @Endpoint: url/product
// @Body Expectation: {
//	 	name, description, price
//	 } as JSON
// @Returns: Posted product | Error Message

routes.post("/product", async (req, res) => {
	try {
		// extracting product details from request body:
		const { name, description, price } = req.body;
		// inserting the product into the database
		const newProduct = await pool.query(
			"INSERT INTO products (product_name, product_description, product_price) VALUES($1, $2, $3) RETURNING *",
			// RETURNING* adds the data to the newProduct variable
			[name, description, price]
		);
		// sending the json response
		res.status(201).json(newProduct.rows[0]);
	} catch (error) {
		// returning error message if error occurs during the post operation:
		res.status(500).send({
			message: error.message,
		});
	}
});

// @Description: view all products:
// @Request: GET
// @Endpoint: url/products
// @Returns: All Product Details | Error
routes.get("/products", async (req, res) => {
	try {
		// query the products table in the database:
		const products = await pool.query("SELECT * FROM products");
		// return the products to the client:
		res.json(products.rows);
	} catch (error) {
		res.status(500).send({
			message: error.message,
		});
	}
});

// @Description: view all inventory details
// @Request: GET
// @Endpoint: url/inventory
// @Returns: All Inventory Details | Error
routes.get("/inventory", async (req, res) => {
	try {
		const inventories = await pool.query("SELECT * FROM inventory");
		res.json(inventories.rows);
	} catch (error) {
		return res.status(400).send({
			message: error.message,
		});
	}
});

// @Description: get a row from inventory
// @Request: GET
// @Endpoint: url/inventory/id
// @Returns: Inventory Details of the given ID | Error
routes.get("/inventory/:id", async (req, res) => {
	try {
		// extracting the inventory id from the request body
		const { id } = req.params;
		// querying the inventory table for the given id
		const inventory = await pool.query(
			"SELECT * FROM inventory WHERE inventory_id = $1",
			[id]
		);
		// if the given ID is invalid:
		if (inventory.rowCount == 0)
			return res.status(404).send("Inventory with given ID does not exist");
		res.json(inventory.rows);
	} catch (error) {
		return res.status(500).send({
			message: error.message,
		});
	}
});

// @Description: update an inventory
// @Request: PUT
// @Endpoint: url/inventory/id
// @Returns: Inventory Details of the Updated Inventory | Error
routes.put("/inventory/:inventory_id", async (req, res) => {
	// function to set up the query from the given arguments for the update operation
	const updateInventoryById = (id, cols) => {
		// Setup static beginning of query
		var query = ["UPDATE inventory"];
		query.push("SET");

		// Create another array storing each set command
		// and assigning a number value for parameterized query
		var set = [];
		Object.keys(cols).forEach((key, i) => {
			set.push(key + " = ($" + (i + 1) + ")");
		});
		query.push(set.join(", "));

		// Add the WHERE statement to look up by id
		query.push("WHERE inventory_id = " + id + "RETURNING *");

		// Return a complete query string
		return query.join(" ");
	};
	try {
		// extractinf inventory_id from request body:
		const { inventory_id } = req.params;
		// list of columns to update for the given inventory
		const columnsToUpdate = req.body;
		// updated column values:
		const colValues = Object.keys(req.body).map((key) => req.body[key]);
		// genereating the query string:
		const query = updateInventoryById(inventory_id, columnsToUpdate);
		// querying the database:
		const updatedInventory = await pool.query(query, colValues);
		// if no inventory with the given id exists:
		if (updatedInventory.rowCount == 0)
			return res.status(404).send("Inventory with given ID does not exist");
		// send the updated Inventory:
		res.json(updatedInventory.rows[0]);
	} catch (error) {
		return res.status(500).send({
			message: error.message,
		});
	}
});

// @Description: delete a product and therefore it's inventory
// @Request: DELETE
// @Endpoint: url/product/id
// @Returns: Deleted Product Details | Error
routes.delete("/product/:product_id", async (req, res) => {
	try {
		// extracting product id from the request paramater
		const { product_id } = req.params;
		// deleting the product from the database:
		const deletedProduct = await pool.query(
			"DELETE FROM products WHERE product_id = $1 RETURNING *",
			[product_id]
		);
		// if no product exists with the given id:
		if (deletedProduct.rowCount == 0)
			return res.status(404).send("Product with the given ID does not exist");
		// return the deleted product details:
		res.json(deletedProduct.rows[0]);
	} catch (error) {
		return res.status(500).send({
			message: error.message,
		});
	}
});

module.exports = routes;
