const mysql = require("mysql");
const cities = require('all-the-cities');
const NUM_OF_CITIES = 15;
const NUM_OF_STORES = 50;


const citiesUS = cities.filter(city => city.country.match('US')).map(city => {
    return {
        name: city.name,
        population: city.population
    }
});

const citiesInDb = []
for (let i = 0; i < NUM_OF_CITIES; i++) {
    citiesInDb.push(citiesUS[i]);
}

const ManufacturerNames = [
    "Balisto",
    "Bamba",
    "Bambeanos",
    "Barcel",
    "Barny Cakes",
    "Beer Nuts",
    "Bell Brand Snack Foods",
    "Better Made Potato Chips",
    "BiFi",
    "Big D",
    "Bissli"
];

const CATEGORYNAMES = [
    "Dinners, stew or soups for toddlers, ready-to-serve",
    "Fruits for toddlers, ready-to-serve",
    "Vegetables for toddlers, ready-to-serve",
    "Eggs/egg yolks, ready-to-serve",
    "Juices, all varieties",
    "Breakfast cereals, ready-to-eat, weighing 43 g or more per cup; biscuit types",
    "Bran or wheat grain"
];

const PRODUCT_NAMES = [
    "Lays Sour Cream and Onion Chips",
    "Barbecue Lay's Potato Chips",
    "CHEDDAR AND SOUR CREAM LAYS",
    "Barbecue Baked Lays",
    "Salt and Vinegar Chips",
    "LIMON CHIPS",
    "XXtra Flamin' Hot",
    "Flamin' Hot Puffs",
    "Puffs",
    "Cheetos Paws",
    "Baked Crunchy",
    "Flamin' Hot"
];


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}


function getSQLDateFromDatetime(date) {
    return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
}



const sqlConnection = mysql.createConnection({
    host:  "your host name",
    user: "your user name",
    password: "your password",
    database: "your database name"
});


function backfillLocation(){
    citiesInDb.forEach(city => {
        sqlConnection.query(`INSERT INTO location (city_name, state, population) values ( "${city.name}", "MA", ${city.population})`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    });
}

function backfillStore(){
    for (let i = 0; i < NUM_OF_STORES; i++) {
        const randomInt = getRandomInt(0, NUM_OF_CITIES);
        sqlConnection.query(`INSERT INTO Store (store_num, phone_number, street_address, city_name, state) \
            values ( ${i}, "857-210-2666","60 Glenwood Street" , "${citiesInDb[randomInt].name}", "MA")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    }
}


function backfillManufacturer() {
    ManufacturerNames.forEach(ManufacturerName => {
        sqlConnection.query(`INSERT INTO Manufacturer (name, maximum_discount) values ( "${ManufacturerName}", 70.0)`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    });    
}

function backfillCategory() {
    CATEGORYNAMES.forEach(CategoryName => {
        sqlConnection.query(`INSERT INTO Category (name) values ( "${CategoryName}")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    });
}

function backfillProduct() {
    let i = 0;
    PRODUCT_NAMES.forEach(ProductName => {
        const manufacturer_randomInt = getRandomInt(0, ManufacturerNames.length);
        const category_randomInt = getRandomInt(0, CATEGORYNAMES.length);
        sqlConnection.query(`INSERT INTO Product (pid, product_name, retail_price, manufacturer_name, category_name) \
            values ( ${i++}, "${ProductName}", ${getRandomInt(150, 200)}, "${ManufacturerNames[manufacturer_randomInt]}", "${CATEGORYNAMES[category_randomInt]}")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    });
}

function backfillSold() {
    let d = new Date();
    for (let i = 0 ; i < 200; i++) {
        const storenum_rondom = getRandomInt(0, NUM_OF_STORES);
        const pid_rondom = getRandomInt(0, PRODUCT_NAMES.length);
        d.setDate(d.getDate()-1);
        // console.log(d);
        sqlConnection.query(`INSERT INTO Sold (pid, store_num, sell_date, sell_quantity) \
            values ( ${pid_rondom}, ${storenum_rondom}, "${getSQLDateFromDatetime(d)}", "${getRandomInt(0, 1000)}")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    }
}

function backfillSale() {
    let d = new Date();
    for (let i = 0 ; i < 5; i++) {
        const pid_rondom = getRandomInt(0, PRODUCT_NAMES.length);
        d.setDate(d.getDate()-3);
        // console.log(d);
        sqlConnection.query(`INSERT INTO Sale (pid, sale_date, sale_price) \
            values ( ${pid_rondom}, "${getSQLDateFromDatetime(d)}", "${getRandomInt(100, 150)}")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    }
}

function backfillHoliday(){
    let d = new Date();
    for (let i = 0 ; i < 2; i++) {
        const pid_rondom = getRandomInt(0, PRODUCT_NAMES.length);
        d.setDate(d.getDate()-5);
        // console.log(d);
        sqlConnection.query(`INSERT INTO Holiday (name, date) \
            values ( "Chinese New Year", "${getSQLDateFromDatetime(d)}")`, (err, rows, fields) => {
            console.log(rows);
            if (err) {
                console.log(err);
            }
        });
    }
}


sqlConnection.connect((err) => {
    if (err) throw err;
    // backfill order matters
    backfillLocation();
    backfillStore();
    backfillManufacturer();
    backfillCategory();
    backfillProduct();
    backfillSold();
    backfillSale();
    backfillHoliday();

    throw "Stop the program. Success"
});

