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
    runSearch();
});

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
            name: "quatity",
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
            for (var i = 0; i < res.length; i++) {
                console.log("You have slected " + res[i].product_name);
            }

            // Will move this once shopping logic is done
            connection.end();
        });
    });
}