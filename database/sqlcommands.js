const mysql = require('mysql2')


const createUserTable = `
CREATE TABLE IF NOT EXISTS User(
    userid VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    fullname VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`

const createAdminTable = `
CREATE TABLE IF NOT EXISTS Admin(
    admin_id VARCHAR(255) NOT NULL PRIMARY KEY,
    level VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    FOREIGN KEY (userid) REFERENCES User(userid)
);`

const createAddressTable = `
CREATE TABLE IF NOT EXISTS Address(
    address_id VARCHAR(255) NOT NULL PRIMARY KEY,
    state VARCHAR(255) NOT NULL,
    lga VARCHAR(255) NOT NULL,
    house_address VARCHAR(255) NOT NULL
);`


const createCustomerTable = `
CREATE TABLE IF NOT EXISTS Customer(
    cusid VARCHAR(255) NOT NULL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL,
    address_id VARCHAR(255) NOT NULL,
    FOREIGN KEY (userid) REFERENCES User(userid),
    FOREIGN KEY (address_id) REFERENCES Address(address_id)
);`


const dropTable = tableName => `DROP TABLE IF EXISTS ${tableName};`;

const insertSignup = `insert into User(userid, fullname, email, userpassword) values(?,?,?,?)`

const checkEmailLogin = `select * from User where email = ?`

const updateLogin = "update User set userpassword = ? where email = ?"

module.exports = {
    createUserTable,
    createAdminTable,
    createCustomerTable,
    createAddressTable,
    dropTable,
    insertSignup,
    checkEmailLogin,
    updateLogin
}