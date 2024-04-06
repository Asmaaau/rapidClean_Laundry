const getCusByID = "select * from Customer where cus_id = ?";

const getAllCustomer = "select * from Customer";

module.exports = {
    getCusByID,
    getAllCustomer,
}
