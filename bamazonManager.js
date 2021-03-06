require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var dbPasswd = require("./db_pass.js");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: dbPasswd.passwd,
    database: "bamazon"
});

// When connection to the DB was successful, give the user the main menu
connection.connect(function (err) {
    if (err) throw err;
    // console.log(dbPasswd.passwd);
    runWelcome();
});

function runWelcome() {
    inquirer.prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product",
            "exit"
        ]
    }).then(function (answer) {
        switch (answer.action) {
            case "View Products for Sale":
                viewProducts();
                break;

            case "View Low Inventory":
                viewLowInventory();
                break;

            case "Add to Inventory":
                addToInventory();
                break;

            case "Add New Product":
                addNewProduct();
                break;

            case "exit":
                connection.end();
                break;
        }
    });
}

function viewProducts() {
    var query = "SELECT * FROM products";
    connection.query(query, function (err, res) {
        if (err) throw err;
        var resObj = {};

        function Item(product_name, department_name, price, stock_quantity) {
            // this.item_id = item_id;
            this.product_name = product_name;
            this.department_name = department_name;
            this.price = price;
            this.stock_quantity = stock_quantity;
        }
        // Log all results of the SELECT statement
        // console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
        for (var i = 0; i < res.length; i++) {
            resObj[res[i].item_id] = new Item(res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
        }
        console.table(resObj);
        runWelcome();
    });
}

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    // connection.query(query, function (err, res) {

    //     console.table(res, ["item_id", "product_name", "stock_quantity"]);
    // });

    // runWelcome();
    connection.query(query, function (err, res) {
        if (err) throw err;
        var resObj = {};

        function Item(product_name, department_name, price, stock_quantity) {
            // this.item_id = item_id;
            this.product_name = product_name;
            this.department_name = department_name;
            this.price = price;
            this.stock_quantity = stock_quantity;
        }
        // Log all results of the SELECT statement
        // console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
        for (var i = 0; i < res.length; i++) {
            resObj[res[i].item_id] = new Item(res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity);
        }
        console.table(resObj);
        runWelcome();
    });
}

function addToInventory() {
    var productNames = [];
    var query = "SELECT product_name, stock_quantity FROM products";
    connection.query(query, function (err, res) {
        for (var i = 0; i < res.length; i++) {
            productNames.push(res[i].product_name);
        }
        // console.log(productNames);
        // console.log(res);

        inquirer.prompt([
            {
                name: "selectItem",
                type: "list",
                message: "Which item would you like to add more of?",
                choices: productNames
            },
            {
                name: "quantityToAdd",
                type: "input",
                message: "How much would you like to add?",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (inquirerResponse) {
            // my convoluted way to update the quantity
            var productUpdate = parseInt(res[productNames.indexOf(inquirerResponse.selectItem)].stock_quantity) + parseInt(inquirerResponse.quantityToAdd);
            // console.log(productUpdate);
            var query = "UPDATE products SET ? WHERE ?";
            connection.query(query, [{ stock_quantity: productUpdate }, { product_name: inquirerResponse.selectItem }], function (err, res) {
                if (res) {
                    console.log("Sucessfully updated");
                } else {
                    console.log("An error occured");
                    throw err;
                }

                runWelcome();
            });
        });
    });
}

function addNewProduct() {

    inquirer.prompt([
        {
            name: "itemName",
            type: "input",
            message: "Please enter the name of the item to add:"
        },
        {
            name: "department",
            type: "input",
            message: "Which department will this be added to?"
        },
        {
            name: "price",
            type: "input",
            message: "Enter the unit price:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "quantity",
            type: "input",
            message: "Enter the inital quantity:",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (inquirerResponse) {
        var insertItem = {
            product_name: inquirerResponse.itemName,
            department_name: inquirerResponse.department,
            price: inquirerResponse.price,
            stock_quantity: inquirerResponse.quantity
        };
        // console.log(insertItem);
        var query = "INSERT INTO products SET ?";
        connection.query(query, [insertItem], function (err, res) {
            if (res) {
                console.log("Added successfully");
            } else {
                console.log("An error occured");
                throw err;
            }

            runWelcome();
        });
    });
}