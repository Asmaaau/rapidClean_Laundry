const createCustomerTable = `
CREATE TABLE IF NOT EXISTS Customer(
    cus_id VARCHAR(255) NOT NULL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE,
    phone_no VARCHAR(255),
    image_url VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    salt VARCHAR(255) NOT NULL,
    address_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);`;

// create salt and add NOT NULL to the salt column

const createAddressTable = `
CREATE TABLE IF NOT EXISTS Address(
    address_id VARCHAR(255) NOT NULL PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    lga VARCHAR(255) NOT NULL,
    house_address VARCHAR(255) NOT NULL
);`;

const createAdminTable = `
CREATE TABLE IF NOT EXISTS Admin(
    admin_id VARCHAR(255) NOT NULL PRIMARY KEY,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    salt VARCHAR(255) NOT NULL,
    level VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL
);`;

const createOrderTable = `
CREATE TABLE IF NOT EXISTS CustomerOrder(
    order_id VARCHAR(255) NOT NULL PRIMARY KEY,
    order_status VARCHAR(255),
    cus_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (cus_id) REFERENCES Customer(cus_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createProductTable = `
CREATE TABLE IF NOT EXISTS Product(
    prod_id VARCHAR(255) NOT NULL PRIMARY KEY,
    prod_type VARCHAR(255),
    icon_url VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createServicesTable = `
CREATE TABLE IF NOT EXISTS Services(
    service_id VARCHAR(255) NOT NULL PRIMARY KEY,
    prod_id VARCHAR(255),
    service_type VARCHAR(255),
    price VARCHAR(255),

    FOREIGN KEY (prod_id) REFERENCES Product(prod_id)
);`;

const createExtrasTable = `
CREATE TABLE IF NOT EXISTS Extras(
    extras_id VARCHAR(255) NOT NULL PRIMARY KEY,
    extras_type VARCHAR(255),
    description VARCHAR(255),
    price VARCHAR(255)
);`;

const createOrderDetailsTable = `
CREATE TABLE IF NOT EXISTS OrderDetails(
    OD_id VARCHAR(255) NOT NULL PRIMARY KEY,
    total_sum DECIMAL(10,2),
    isDeleted  BOOLEAN DEFAULT FALSE,
    quantity INT,
    extras_id VARCHAR(255),
    service_id VARCHAR(255),
    prod_id VARCHAR(255),
    order_id VARCHAR(255),

    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (extras_id) REFERENCES Extras(extras_id),
    FOREIGN KEY (prod_id) REFERENCES Product(prod_id),
    FOREIGN KEY (service_id) REFERENCES Services(service_id)
);`;

const createDeliveryModeTable = `
CREATE TABLE IF NOT EXISTS OrderMode(
    orderMode_id VARCHAR(255) NOT NULL PRIMARY KEY,
    orderMode VARCHAR(255),
    hint VARCHAR(255)
);`;

const createDeliveryTable = `
CREATE TABLE IF NOT EXISTS Delivery(
    delivery_id VARCHAR(255) NOT NULL PRIMARY KEY,
    order_id VARCHAR(255),
    orderMode_id VARCHAR(255),
    price VARCHAR(255),

    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (orderMode_id) REFERENCES OrderMode(orderMode_id)
);`;

const dropTable = (tableName) => `DROP TABLE IF EXISTS ${tableName};`;

const insertSignup = `insert into Customer(cus_id, fullname, email, userpassword, salt) values(?,?,?,?,?)`;

const checkEmailLogin = `select * from Customer where email = ?`;

const updateLogin = "update Customer set userpassword = ?, salt = ? where email = ?";

const getUserByID = "select * from Customer where cus_id = ?";

// Products

const pushProduct =  "insert into Product(prod_id, prod_type, icon_url) values(?,?,?)"

// const getAllProducts = 

const pushServices =  "insert into Services(service_id, service_type, price) values(?,?)"

module.exports = {
    createAdminTable,
    createCustomerTable,
    createAddressTable,
    createOrderTable,
    createProductTable,
    createServicesTable,
    createExtrasTable,
    createOrderDetailsTable,
    createDeliveryModeTable,
    createDeliveryTable,
    dropTable,
    insertSignup,
    checkEmailLogin,
    updateLogin,
    getUserByID,
    pushProduct,
    pushServices
};
