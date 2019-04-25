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
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        // Log all results of the SELECT statement
        console.table(res, ["item_id", "product_name", "price", "stock_quantity"]);
        // for (var i=0; i<res.length; i++){

        // }
        runWelcome()
    });
}

function viewLowInventory() {
    var query = "SELECT * FROM products WHERE stock_quantity < 5";
    connection.query(query, function (err, res) {

        console.table(res, ["item_id", "product_name", "stock_quantity"]);
    });

    runWelcome();
}

function addToInventory() {

}

function addNewProduct() {

}