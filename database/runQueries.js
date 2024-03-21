const {connectDB} = require('./db.config')
const {createUserTable, createAdminTable, createCustomerTable, createAddressTable, dropTable} = require('./sqlcommands')


const createTables = async(req, res)=>{
     const connection = await connectDB()

     connection.query("SHOW TABLES LIKE 'User'", async (err, result) => {
        if (err) {
            connection.release();
            throw err;
        }

        if (result.length === 0 ) {
            try {
                await connection.query(createUserTable);
                await connection.query(createAdminTable);
                await connection.query(createAddressTable);
                await connection.query(createCustomerTable);
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
    
    //  connection.query(createUserTable, (err, result)=> {
    //     connection.release();
    //     if(err) throw err;
    //     else {
    //         console.log(result)
    //     }
    //  })

    //  connection.query(createAdminTable, (err, result)=> {
    //     connection.release();
    //     if(err) throw err;
    //     else {
    //         console.log(result)
    //     }
    //  })

    //  connection.query(createAddressTable, (err, result)=> {
    //     connection.release();
    //     if(err) throw err;
    //     else {
    //         console.log(result)
    //     }
    //  })

    //  connection.query(createCustomerTable, (err, result)=> {
    //     connection.release();
    //     if(err) throw err;
    //     else {
    //         console.log(result)
    //     }
    //  })
}

const dropped = async(req, res)=>{
    const connection = await connectDB()

    connection.query(dropTable("Admin"), (err, result)=> {
        connection.release();
        if(err) throw err;
        else {
            console.log(result)
        }
     })
    
}

module.exports = {createTables, dropped}
