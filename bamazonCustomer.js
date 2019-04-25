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

// Main menu. Ask the user if they want to shop or quit
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

// We'll ask the user what they want, how many they want, and search the DB for it
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
                // Ask if the user is sure
                inquirer.prompt([
                    {
                        name: "confirmPurchase",
                        type: "confirm",
                        message: "You have selected " + res[0].product_name + ". Are you sure you want to buy " + answer.quantity + "?",
                        default: true
                    }
                ]).then(function (inquirerResponse) {
                    // If the user is sure of their purchase, we'll update the db
                    if (inquirerResponse.confirmPurchase) {
                        // Things we'll need to complete the checkout
                        var dbID = res[0].item_id;
                        var quantToBuy = answer.quantity;
                        var amountInDB = res[0].stock_quantity;
                        var unitPrice = res[0].price;
                        runPurchase(dbID, quantToBuy, amountInDB, unitPrice);
                    } else {
                        // If the user is unsure, return to main menu
                        runWelcome();
                    }
                });

            } else {
                // If the user enters an invalid ID, return to main menu, stop transaction
                console.log("Item ID is not valid.");
                runWelcome();
            }

        });
    });
}

function runPurchase(dbID, quantToBuy, amountInDB, unitPrice) {
    // console.log(dbID);
    // console.log(quantToBuy);

    // Make sure enough items are in stock
    if (quantToBuy <= amountInDB) {
        // We'll figure out how may items are left in the DB and update it with the new amount left in stock
        var updateAmount = amountInDB - quantToBuy;

        var query = "UPDATE products SET ? WHERE ?";
        connection.query(query, [{ stock_quantity: updateAmount }, { item_id: dbID }], function (err, res) {
            // If the DB was successfully updated, we'll let the customer know how much they spent
            if (res.affectedRows > 0) {
                console.log("Purchase processed.");
                console.log("Your total is $" + (quantToBuy * unitPrice));
            } else {
                // In case something goes wrong updating the DB
                console.log("An error has occured");
                throw err;
            }
            runWelcome();
        });

    } else {
        // If not enough items are in stock, send them back to the main menu
        console.log("Insufficient quantity!");
        runWelcome();
    }
}