// customers info

const insertSignup = `insert into Customer(cus_id, fullname, email, userpassword, salt, emailToken) values(?,?,?,?,?,?)`;

const checkEmailLogin = `select * from Customer where email = ?`;

const checkEmailToken = `select * from Customer where emailToken = ?`;

const updateLogin = "update Customer set userpassword = ?, salt = ? where email = ?";

// const updateVerify = "update Customer set isVerified = ? where emailToken = ?";
const updateVerify = "update Customer set isVerified = ?, emailToken = NULL where emailToken = ?";

const getCusByID = "select * from Customer where cus_id = ?";

const getAllCustomer = "select * from Customer";

module.exports = {
     insertSignup,
    checkEmailLogin,
    checkEmailToken,
    updateLogin,
    getCusByID,
    updateVerify,
    getAllCustomer,
}
