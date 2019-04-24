CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT AUTO_INCREMENT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    primary key(item_id)
);

-- mock data --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Thinkpad", "electronics", 599.99, 20000);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Brave New World", "books", 9.99, 15550);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Screw Driver Set", "hardware", 25.50, 26800);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Frozen Pizza", "freezer", 20.00, 55600);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Macbook", "electronics", 1500.00, 14800);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Chocolate Ice Cream", "freezer", 14.95, 13590);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("T-shirts", "clothing", 9.25, 23400);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Jeans", "clothing", 9.95, 32400);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Dremel", "hardware", 50.75, 89210);
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Nintendo Switch", "electronics", 300.00, 30000);