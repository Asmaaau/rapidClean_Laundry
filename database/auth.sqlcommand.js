const insertSignup = `insert into Customer( fullname, email, userpassword, salt, emailToken) values(?,?,?,?,?)`;

const checkEmailLogin = `select * from Customer where email = ?`;

const checkEmailToken = `select * from Customer where emailToken = ?`;

// const updateToken = "update Customer set userpassword = ?, salt = ? where email = ?";

const updateLogin = "update Customer set userpassword = ?, salt = ? where email = ?";

const updateVerify = "update Customer set isVerified = ?, emailToken = NULL where emailToken = ?";

const updateEmailToken = "update Customer set emailToken = ? where email = ?"

module.exports = {
     insertSignup,
    checkEmailLogin,
    checkEmailToken,
    updateLogin,
    updateVerify,
    updateEmailToken,
}
