# bamazon

## About
This app comes with 2 programs: ```bamazonCustomer ``` and ```bamazonManager```. 
- ```bamazonCustomer``` allows you to buy items from the database.
- ```bamazonManager``` allows you to manage items in the database

## Installation
```
$ git clone git@github.com:mputterf/bamazon.git 
$ cd bamazon
$ npm install
```

Next, create a file called `.env` inside the `bamazon` directory.  
Inside the file, you will put your for your MySQL database like so:
```
DB_PASSWD=<YOUR_PASSWORD_HERE>
```

## Usage
```
$ node bamazonCustomer 
```
or
```
$ node bamazonCustomer
```

## bamazonCustomer
Proceed to shop or quit the program

![bamazonCustomer ex](./readmeimgs/bamazoncustomer.png)

### Shop
You will take you through the process of purchasing an item. Fill out the ID of the item and how may you would like to buy. You will be shown the total when you checkout.

![bamazonCustomer ex](./readmeimgs/bamazoncustomer-shop.png)

### Quit
Quits the program

## bamazonManager
Manage the items for sale. You can view and add items

![bamazonCustomer ex](./readmeimgs/bamazonmanager.png)

### View Products for Sale

![bamazonCustomer ex](./readmeimgs/bamazonmanager-viewall.png)

### View Low Inventory
View items with a quantity less than 5

![bamazonCustomer ex](./readmeimgs/bamazonmanager-viewlow.png)

### Add to Inventory
Select the item you would like to add more stock of.

![bamazonCustomer ex](./readmeimgs/bamazonmanager-addlow1.png)

![bamazonCustomer ex](./readmeimgs/bamazonmanager-addlow2.png)

### Add New Product
Add a new item to the database

![bamazonCustomer ex](./readmeimgs/bamazonmanager-addnew.png)

### exit
Quits the program