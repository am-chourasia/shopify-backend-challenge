# Shopify-backend-challenge

[Shopify Backend Developer Intern Challenge - Summer 2022](https://docs.google.com/document/d/1z9LZ_kZBUbg-O2MhZVVSqTmvDko5IJWHtuFmIu_Xg1A/edit#)

Inventory Tracking web app for the products of a company.
</br>
Additional Feature Chosen: **Push a button export product data to a CSV**

> Candidate: Ashish Manoj Chourasia

## 📜 Tech-Stack Used:

<p> 
  <a href="https://nodejs.org" target="_blank"> 
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="60" height="60"/> 
  </a> 
  <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank"> 
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="60" height="60"/> 
  </a> 
  <a href="https://expressjs.com" target="_blank"> 
  <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="60" height="60"/> 
  </a> 
  <a href="https://www.postgresql.org/" target="_blank">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original-wordmark.svg" alt="PostgreSQL" width="60" height="60"/>
  </a>
</p>

</br>
</br>

## 💾 Installation and usage

### Pre-requisites :

> [Node](https://nodejs.org) should be installed on the system \
> [PostgreSQL](https://www.postgresql.org/) should be installed and configured on the system.

1. Clone the repo:

   ```
   git clone https://github.com/am-chourasia/shopify-backend-challenge.git
   ```

2. Start the postresql database service:
   ```
   sudo service postgresql start
   ```
3. Login to the postgresql with your credentials.
4. Run the database commands in the [database](/database.sql) file to create the tables.
5. Setup your environement variables in .env file from the .env environment example given.
6. Open the terminal and start the server. \
   This will expose the API Endpoints on the host and port specified in the .env file:
   ```
   npm start
   ```

</br>
</br>

## 💽 API Details:

## Routes

| Endpoint          | Method | Description                                                                         |
| ----------------- | :----: | :---------------------------------------------------------------------------------- |
| /products         |  GET   | View all products:                                                                  |
| /product          |  POST  | Add a new Product in the products table which also reflects in the inventory table: |
| /product/id       | DELETE | delete a product and therefore it's inventory                                       |
| /inventory        |  GET   | view all inventory details                                                          |
| /inventory/id     |  GET   | get a row from inventory                                                            |
| /inventory/id     |  PUT   | update an inventory                                                                 |
| /export/product   |  GET   | Export the product details to a csv file                                            |
| /export/inventory |  GET   | Export the inventory details to a csv file                                          |

</br>
</br>

## Examples of Requests and Response:

1.  GET Products:

    ```
    curl --request GET 'http://localhost:5000/products'
    ```

    ```
    [
        {
            "product_id": 8,
            "product_sku": '159632',
            "product_name": "Killer",
            "product_description": "Shirts like no other",
            "product_price": 999
        },
        {
            "product_id": 9,
            "product_sku": '147852',
            "product_name": "Bummer",
            "product_description": "Luxury like never before",
            "product_price": 400
        }
    ]
    ```

2.  POST Product:

    ```
    curl --location --request POST 'http://localhost:5000/product' \
        --header 'Content-Type: text/plain' \
        --data-raw '{
            "sku" : "456123",
            "name" : "Laptops",
            "description": "Laptops for work",
            "price" : 70000
        }'
    ```

    ```
    {
        "product_id": 11,
        "product_sku": "456123",
        "product_name": "Laptops",
        "product_description": "Laptops for work",
        "product_price": 70000
    }
    ```

3.  DELETE Product with given ID:

    ```
    curl --location --request DELETE 'http://alocalhost:5000/product/11'
    ```

    ```
    {
        "product_id": 11,
        "product_sku": "456123",
        "product_name": "Laptops",
        "product_description": "Laptops for work",
        "product_price": 70000
    }
    ```

4.  GET Inventory of all the products:

    ```
    curl --location --request GET 'http://localhost:5000/inventory'
    ```

    ```
    [
        {
            "inventory_id": 6,
            "product_id": 8,
            "product_sku": "159632",
            "incoming": 0,
            "available": 0,
            "ordered": 0,
            "sold": 0
        },
        {
            "inventory_id": 7,
            "product_id": 9,
            "product_sku": "147852",
            "incoming": 0,
            "available": 0,
            "ordered": 0,
            "sold": 0
        }
    ]
    ```

5.  GET Invetory of a particular Product:

    ```
    curl --location --request GET 'http://localhost:5000/inventory/6'
    ```

    ```
    [
        {
            "inventory_id": 6,
            "product_id": 8,
            "product_sku": "159632",
            "incoming": 0,
            "available": 0,
            "ordered": 0,
            "sold": 0
        }
    ]
    ```

6.  PUT Update Inventory Details of a product:

    ```
    curl --location --request PUT 'http://localhost:5000/inventory/6' \
        --header 'Content-Type: application/json' \
        --data-raw '{
            "incoming": 10,
            "available": 50,
            "ordered": 18,
            "sold": 25
        }'
    ```

    ```
    {
        "inventory_id": 6,
        "product_id": 8,
        "product_sku": "159632",
        "incoming": 10,
        "available": 50,
        "ordered": 18,
        "sold": 25
    }
    ```

7.  EXPORT Product Details:

    ```
    curl --location --request GET 'http://localhost:5000/export/products'
    ```

    ```
    CSV File containing the product details
    ```

8.  EXPORT Inventory Details:
    ```
    curl --location --request GET 'http://localhost:5000/export/inventory'
    ```
    ```
    CSV File containing the Inventory Details of all Products
    ```
