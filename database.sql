CREATE DATABASE shopify_inventory;

CREATE TABLE products(
    product_id INT GENERATED ALWAYS AS IDENTITY,
    product_sku VARCHAR(20) UNIQUE,
    product_name VARCHAR(20) NOT NULL,
    product_description VARCHAR(100) NOT NULL,
    product_price INT NOT NULL,
    CONSTRAINT positive_price CHECK(product_price > 0),
    PRIMARY KEY(product_id)
);

CREATE TABLE inventory(
    inventory_id INT GENERATED ALWAYS AS IDENTITY,
    product_id INT NOT NULL,
    product_sku VARCHAR(20) UNIQUE,
    incoming INT DEFAULT 0 CHECK (incoming >= 0),
    available INT DEFAULT 0 CHECK (available >= 0),
    ordered INT DEFAULT 0 CHECK (ordered >= 0), 
    sold INT DEFAULT 0 CHECK (sold >= 0),

    PRIMARY KEY(inventory_id),
    CONSTRAINT positivity 
      CHECK(
          incoming >= 0 AND
          available >= 0 AND 
          ordered >= 0 AND
          sold >= 0
        ),
    
    CONSTRAINT fk_sku
      FOREIGN KEY(product_sku) 
	  REFERENCES products(product_sku)
      ON UPDATE CASCADE
      ON DELETE CASCADE,

    CONSTRAINT fk_product
      FOREIGN KEY(product_id) 
	  REFERENCES products(product_id)
      ON DELETE CASCADE
);

-- trigger to automaically insert a new column into inverntory when a new product is created
CREATE FUNCTION add_inventory()
    RETURNS TRIGGER
AS $$
BEGIN
    INSERT INTO inventory(product_id, product_sku)
    VALUES(new.product_id, new.product_sku);
    RETURN new;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER new_inventory 
    AFTER INSERT
    ON products
    FOR EACH ROW 
        EXECUTE PROCEDURE add_inventory();