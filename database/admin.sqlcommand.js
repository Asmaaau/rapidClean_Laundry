const insertAdminSignup = `insert into Admin( fullname, email, userpassword, salt, emailToken) values(?,?,?,?,?)`;

const AdminEmailLogin = `select * from Admin where email = ?`;

const AdminEmailToken = `select * from Admin where emailToken = ?`;

const updateAdminLogin = "update Admin set userpassword = ?, salt = ? where email = ?";

const updatAdminVerify = "update Admin set isVerified = ?, emailToken = NULL where emailToken = ?";

const updateAdminEmailToken = "update Admin set emailToken = ? where email = ?"

const getAdminByID = "select * from Admin where admin_id = ?";

module.exports = {
     insertAdminSignup,
     AdminEmailLogin,
     AdminEmailToken,
     updateAdminLogin,
     updatAdminVerify,
     updateAdminEmailToken,
     getAdminByID
}
