const { connectDB } = require('./db.config')
// const { createAdminTable, createCustomerTable, createAddressTable, dropTable, createOrderTable, createProductTable, createServicesTable, createExtrasTable, createOrderDetailsTable, createDeliveryModeTable, createCategoryTable } = require('./sqlcommands')
const { createAdminTable, createCustomerTable, dropTable, createOrderTable, createProductTable, createServicesTable, createExtrasTable, createOrderDetailsTable, createDeliveryModeTable, createDeliveryTable, createCategoryTable, createTestimonialsTable } = require('./sqlcommands')
const {  createDeliveryTimeTable, createContactInfoTable, createBlogTable, createBlogCategoryTable, createNewsLetterTable,} = require('./sqlcommands')

// const createTables = async (req, res) => {
//     const connection = await connectDB()

//         try {
//             connection.query(createAdminTable);
//             connection.query(createAddressTable);
//             connection.query(createCustomerTable);
//             connection.release();
//             // console.log("Tables created successfully");
//         } catch (error) {
//             console.error("Error creating tables:", error);
//             connection.release();
//             throw error;
//         }
// }

const createTables = async (req, res, next) => {
    const connection = await connectDB()

    connection.query("SHOW TABLES LIKE 'User'", async (err, result) => {
        if (err) {
            connection.release();
            throw err;
        }

        if (result.length === 0) {
            try {
                connection.query(createAdminTable);
                connection.query(createCustomerTable);
                connection.query(createOrderTable);
                connection.query(createCategoryTable);
                connection.query(createProductTable);
                connection.query(createServicesTable);
                connection.query(createOrderDetailsTable);
                connection.query(createDeliveryModeTable);
                connection.query(createDeliveryTimeTable);
                connection.query(createDeliveryTable);
                connection.query(createContactInfoTable);
                connection.query(createBlogCategoryTable);
                connection.query(createBlogTable);
                connection.query(createNewsLetterTable);
                connection.query(createTestimonialsTable);

                
                
                connection.release();
                // console.log("Tables created successfully");
            } catch (error) {
                console.error("Error creating tables:", error);
                connection.release();
                console.log(error);
                return next(error)
                // throw error;
            }
        } else {
            console.log("Tables already exist");
            connection.release();
        }
    });
}

const dropped = async (req, res) => {
    const connection = await connectDB()

    connection.query(dropTable("Delivery"), (err, result) => {
        connection.release();
        if (err) throw err;
        else {
            console.log(result)
        }
    })
 
}

module.exports = { createTables, dropped }
