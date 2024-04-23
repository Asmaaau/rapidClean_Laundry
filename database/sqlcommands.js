const createCustomerTable = `
CREATE TABLE IF NOT EXISTS Customer(
    cus_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255),
    gender VARCHAR(255),
    image_url VARCHAR(255),
    state VARCHAR(255),
    lga VARCHAR(255),
    house_address VARCHAR(255),
    isVerified BOOLEAN DEFAULT False,
    emailToken VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    salt VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

// ON DELETE SET NULL  -- Optional action: set category to NULL when related category is deleted
    // ON UPDATE CASCADE,  -- Optional action: update category when category_id changes
// cus_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
// cus_id VARCHAR(255) NOT NULL PRIMARY KEY,

// const createAddressTable = `
// CREATE TABLE IF NOT EXISTS Address(
//     address_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     state VARCHAR(255) NOT NULL,
//     lga VARCHAR(255) NOT NULL,
//     house_address VARCHAR(255) NOT NULL
// );`;

const createAdminTable = `
CREATE TABLE IF NOT EXISTS Admin(
    admin_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    userpassword VARCHAR(255) NOT NULL,
    phone_no VARCHAR(255) NOT NULL,
    image_url VARCHAR(255),
    isActive BOOLEAN DEFAULT TRUE,
    salt VARCHAR(255) NOT NULL,
    isVerified BOOLEAN DEFAULT False,
    emailToken VARCHAR(255),
    level VARCHAR(255) NOT NULL,
    userid VARCHAR(255) NOT NULL
);`;

const createOrderTable = `
CREATE TABLE IF NOT EXISTS CustomerOrder(
    order_id VARCHAR(255) NOT NULL PRIMARY KEY,
    order_status VARCHAR(255),
    cus_id INT NOT NULL,
    FOREIGN KEY (cus_id) REFERENCES Customer(cus_id),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);`;

const createCategoryTable = `
CREATE TABLE IF NOT EXISTS Category(
    cat_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    cat_type VARCHAR(255)
);`;

const createProductTable = `
CREATE TABLE IF NOT EXISTS Product(
    prod_id VARCHAR(255) NOT NULL PRIMARY KEY,
    prod_type VARCHAR(255) UNIQUE,
    icon_url VARCHAR(255),
    isDeleted  BOOLEAN DEFAULT FALSE,
    cat_id INT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (cat_id) REFERENCES Category(cat_id) ON DELETE SET NULL ON UPDATE CASCADE
);`;

const createServicesTable = `
CREATE TABLE IF NOT EXISTS Services(
    service_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    prod_id VARCHAR(255),
    service_type VARCHAR(255),
    price VARCHAR(255),

    FOREIGN KEY (prod_id) REFERENCES Product(prod_id) ON UPDATE CASCADE
);`;

// const createExtrasTable = `
// CREATE TABLE IF NOT EXISTS Extras(
//     extras_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
//     extras_type VARCHAR(255),
//     description VARCHAR(255),
//     price VARCHAR(255)
// );`;

const createOrderDetailsTable = `
CREATE TABLE IF NOT EXISTS OrderDetails(
    OD_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(255),
    prod_id VARCHAR(255),
    service_id INT,
    quantity INT,
    total_sum DECIMAL(10,2),
    isDeleted  BOOLEAN DEFAULT FALSE,

    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (prod_id) REFERENCES Product(prod_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (service_id) REFERENCES Services(service_id) ON DELETE SET NULL ON UPDATE CASCADE
);`;

const createDeliveryModeTable = `
CREATE TABLE IF NOT EXISTS OrderMode(
    orderMode_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    orderMode VARCHAR(255),
    spec_instruction VARCHAR(255)
);`;

const createDeliveryTimeTable = `
CREATE TABLE IF NOT EXISTS DeliveryTime(
    time_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    scheduled_time VARCHAR(255),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const createDeliveryTable = `
CREATE TABLE IF NOT EXISTS Delivery(
    delivery_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(255),
    orderMode_id INT,
    price VARCHAR(255),
    scheduled_time INT,
    scheduled_date VARCHAR(255),

    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id),
    FOREIGN KEY (orderMode_id) REFERENCES OrderMode(orderMode_id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (scheduled_time) REFERENCES DeliveryTime(time_id) ON DELETE SET NULL ON UPDATE CASCADE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const createContactInfoTable = `
CREATE TABLE IF NOT EXISTS ContactInfo(
    info_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    fullname VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone_no VARCHAR(255),
    landmark VARCHAR(255),
    order_id VARCHAR(255),

    FOREIGN KEY (order_id) REFERENCES CustomerOrder(order_id) ON DELETE SET NULL ON UPDATE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);`;

const createBlogCategoryTable = `
    CREATE TABLE IF NOT EXISTS BlogCategory(
        category_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        cat_name VARCHAR(255)
    )
`;

const createBlogTable = `
    CREATE TABLE IF NOT EXISTS Blog(
        blog_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        category INT,
        author VARCHAR(255),
        summary VARCHAR(255),
        content TEXT,
        comments VARCHAR(255),
        tags VARCHAR(255),
        popular VARCHAR(255),
        image VARCHAR(255),
        status VARCHAR(255),
        date VARCHAR(255),

        FOREIGN KEY (category) REFERENCES BlogCategory(category_id) ON DELETE SET NULL ON UPDATE CASCADE,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
`;

const createNewsLetterTable = `
    CREATE TABLE IF NOT EXISTS NewsLetter(
        news_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE,
        subscribed INT DEFAULT 1,

        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`;
const createTestimonialsTable = `
    CREATE TABLE IF NOT EXISTS Testimonials(
        test_id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255),
        image VARCHAR(100),
        content TEXT,
        rating DECIMAL,
        
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
`;

const dropTable = (tableName) => `DROP TABLE IF EXISTS ${tableName};`;

module.exports = {
  createAdminTable,
  createCustomerTable,
  createOrderTable,
  createProductTable,
  createServicesTable,
  createOrderDetailsTable,
  createDeliveryModeTable,
  createDeliveryTable,
  createCategoryTable,
  createDeliveryTimeTable,
  createContactInfoTable,
  createBlogTable,
  createBlogCategoryTable,
  createNewsLetterTable,
  createTestimonialsTable,
  dropTable,
};
