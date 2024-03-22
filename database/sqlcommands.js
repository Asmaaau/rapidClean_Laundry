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
    salt VARCHAR(255),
    address_id VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);`

// create salt and add NOT NULL to the salt column

const createAddressTable = `
CREATE TABLE IF NOT EXISTS Address(
    address_id VARCHAR(255) NOT NULL PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    lga VARCHAR(255) NOT NULL,
    house_address VARCHAR(255) NOT NULL
);`


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
);`





const dropTable = tableName => `DROP TABLE IF EXISTS ${tableName};`;

const insertSignup = `insert into Customer(cus_id, fullname, email, userpassword, salt) values(?,?,?,?,?)`

const checkEmailLogin = `select * from Customer where email = ?`

const updateLogin = "update Customer set userpassword = ? where email = ?"

const getUserByID = "select * from Customer where cus_id = ?"

module.exports = {
            createAdminTable,
            createCustomerTable,
            createAddressTable,
            dropTable,
            insertSignup,
            checkEmailLogin,
            updateLogin,
            getUserByID
}