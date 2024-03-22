const { connectDB } = require('./db.config')
const { createAdminTable, createCustomerTable, createAddressTable, dropTable } = require('./sqlcommands')


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
const createTables = async (req, res) => {
    const connection = await connectDB()

    connection.query("SHOW TABLES LIKE 'User'", async (err, result) => {
        if (err) {
            connection.release();
            throw err;
        }

        if (result.length === 0) {
            try {
                connection.query(createAddressTable);
                connection.query(createAdminTable);
                connection.query(createCustomerTable);
                connection.release();
                console.log("Tables created successfully");
            } catch (error) {
                console.error("Error creating tables:", error);
                connection.release();
                throw error;
            }
        } else {
            console.log("Tables already exist");
            connection.release();
        }
    });
}

const dropped = async (req, res) => {
    const connection = await connectDB()

    connection.query(dropTable("Admin"), (err, result) => {
        connection.release();
        if (err) throw err;
        else {
            console.log(result)
        }
    })

}

module.exports = { createTables, dropped }
