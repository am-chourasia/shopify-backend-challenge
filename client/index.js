const baseURL = "http://localhost:5000";
const ProductContainer = document.getElementById("ProductContainer");
const InventoryContainer = document.getElementById("InventoryContainer");
const addProductForm = document.getElementById("add-product");
renderData();

async function renderData() {
	await getData(ProductContainer, "products");
	await getData(InventoryContainer, "inventory");
	addDeleteListeners();
	addEditListeners();
}

async function getData(container, type) {
	try {
		container.innerHTML = "Loading";
		let data;
		const url = baseURL + "/" + type;
		const response = await fetch(url);
		if (!response.ok) throw Error(response.message);

		data = await response.json();
		const table = convertJsontoHtmlTable(data, type);
		container.innerHTML = "";
		container.appendChild(table);
		container.appendChild(exportButton(type));
	} catch (error) {
		container.innerHTML = "Error Fetching the " + type;
		console.error(error);
	}
}

function convertJsontoHtmlTable(data, type) {
	const tablecolumns = [];

	// Getting value for table header
	for (const key in data[0]) {
		tablecolumns.push(key);
	}
	tablecolumns.push("Edit");
	tablecolumns.push("Delete");

	const table = document.createElement("table");

	let tr = table.insertRow(-1);
	for (let i = 0; i < tablecolumns.length; i++) {
		//header
		let th = document.createElement("th");
		th.innerHTML = tablecolumns[i];
		tr.appendChild(th);
	}

	// Add JSON data in table as tr or rows
	for (let i = 0; i < data.length; i++) {
		tr = table.insertRow(-1);
		const form = document.createElement("form");
		const formID = type + "form" + i;
		form.classList.add("edit-form");
		form.setAttribute("id", formID);
		const formCell = tr.insertCell(-1);
		formCell.appendChild(form);
		for (let j = 0; j < tablecolumns.length; j++) {
			const tabCell = tr.insertCell(-1);
			if (
				tablecolumns[j].includes("id") ||
				(tablecolumns[j] === "product_sku" && type === "inventory")
			) {
				tabCell.innerHTML = data[i][tablecolumns[j]];
			} else if (j === tablecolumns.length - 2) {
				let editButton = document.createElement("input");
				editButton.setAttribute("type", "submit");
				editButton.setAttribute("value", "Save");
				editButton.setAttribute("form", formID);
				editButton.classList.add("edit-button");
				let apipath = "";
				if (type === "products")
					apipath = baseURL + "/product/" + data[i].product_id;
				else apipath = baseURL + "/inventory/" + data[i].inventory_id;
				editButton.setAttribute("path", apipath);
				tabCell.appendChild(editButton);
			} else if (j === tablecolumns.length - 1) {
				let deleteButton = document.createElement("button");
				deleteButton.setAttribute("product-id", data[i].product_id);
				deleteButton.classList.add("delete");
				deleteButton.innerText = "Delete";
				tabCell.appendChild(deleteButton);
			} else {
				let label = document.createElement("label");
				label.setAttribute("for", tablecolumns[j]);
				let inputField = document.createElement("input");
				const inputType =
					typeof data[i][tablecolumns[j]] === "string" ? "text" : "number";
				inputField.setAttribute("type", inputType);
				inputField.setAttribute("form", formID);
				inputField.setAttribute("value", data[i][tablecolumns[j]]);
				inputField.setAttribute("name", tablecolumns[j]);
				label.appendChild(inputField);
				tabCell.appendChild(label);
			}
		}
	}
	return table;
}

addProductForm.addEventListener("submit", async (e) => {
	e.preventDefault();
	const submitButton = document.getElementById("submitProduct");
	submitButton.setAttribute("disabled", "disabled");
	submitButton.innerHTML = "Adding...";
	const form = e.currentTarget;
	const apipath = baseURL + "/product";
	try {
		await queryFormDataAsJson("POST", apipath, form);
		form.reset();
		renderData();
	} catch (error) {
		alert(error);
		console.error(error);
	} finally {
		submitButton.removeAttribute("disabled");
		submitButton.innerHTML = "Add Product";
	}
});

async function queryFormDataAsJson(method, url, form) {
	const formData = new FormData(form);
	const plainFormData = Object.fromEntries(formData.entries());
	const formDataJsonString = JSON.stringify(plainFormData);
	const fetchOptions = {
		method: method,
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: formDataJsonString,
	};
	const response = await fetch(url, fetchOptions);
	if (!response.ok) {
		throw new Error(response.message);
	}
	return await response.json();
}

async function addDeleteListeners() {
	const deleteFunction = async function () {
		const product_id = this.getAttribute("product-id");
		const confirmation = confirm(
			"Product and its inventory with product_id = " +
				product_id +
				" will be deleted"
		);
		if (confirmation) {
			try {
				const res = await fetch(baseURL + "/product/" + product_id, {
					method: "DELETE",
				});
				if (!res.ok) throw Error(response.message);
				const response = res.json();
				console.log("Deleted");
				renderData();
			} catch (error) {
				alert(error);
				console.error(error);
			}
		}
	};
	const elements = document.getElementsByClassName("delete");
	for (let i = 0; i < elements.length; i++)
		elements[i].addEventListener("click", deleteFunction);
}

async function addEditListeners() {
	const elements = document.getElementsByClassName("edit-form");
	for (let i = 0; i < elements.length; i++)
		elements[i].addEventListener("submit", async function editFunction(e) {
			e.preventDefault();
			const submitButton = e.submitter;
			submitButton.setAttribute("value", "Saving");
			const form = e.currentTarget;
			const apipath = submitButton.getAttribute("path");
			const confirmation = confirm("Sure you want to update the information?");
			if (confirmation) {
				try {
					await queryFormDataAsJson("PUT", apipath, form);
					console.log("Updated");
				} catch (error) {
					alert(error);
					console.error(error);
				}
			}
			submitButton.setAttribute("value", "Save");
		});
}

function exportButton(type) {
	let link = document.createElement("a");
	let button = document.createElement("button");
	link.setAttribute("href", baseURL + "/export/" + type);
	button.innerHTML = "Export " + type + " details";
	button.classList.add("button");
	link.appendChild(button);
	return link;
}
