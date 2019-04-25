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
            "Shop",
            "Quit"
        ]
    }).then(function (selection) {
        if (selection.action === "Shop") {
            runSearch();
        } else {
            connection.end();
        }
    });
}

function runSearch() {
    inquirer.prompt([
        {
            name: "productID",
            type: "input",
            message: "Enter the ID of the product you want to buy.",
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
            message: "Enter the amount you want to buy.",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }
    ]).then(function (answer) {
        var query = "SELECT * FROM products WHERE item_id= ?";

        connection.query(query, [answer.productID], function (err, res) {
            // console.log(res);

            // Check if item ID is valid
            if (res && res.length) {
                inquirer.prompt([
                    {
                        name: "confirmPurchase",
                        type: "confirm",
                        message: "You have selected " + res[0].product_name + ". Are you sure you want to buy " + answer.quantity + "?",
                        default: true
                    }
                ]).then(function (inquirerResponse) {
                    if (inquirerResponse.confirm) {
                        runPurchase();
                    } else {
                        runWelcome();
                    }
                });

            } else {
                console.log("Item ID is not valid.");
                runWelcome();
            }

        });
    });
}