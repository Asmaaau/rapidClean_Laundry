const mysql = require('mysql2')

// const createTable = `
// CREATE TABLE IF NOT EXISTS User(
//     userid VARCHAR NOT NULL PRIMARY KEY,
//     email VARCHAR UNIQUE NOT NULL,
//     userpassword VARCHAR NOT NULL,
//     image_url VARCHAR,
//     isActive BOOLEAN DEFAULT ,
//     created_at TIMESTAMP NOT NULL,
//     updated_at TIMESTAMP NOT NULL
//   );
// `

const createUserTable = `
CREATE TABLE IF NOT EXISTS User(
    userid VARCHAR(255) NOT NULL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

`

// created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
// updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

module.exports = {createUserTable}