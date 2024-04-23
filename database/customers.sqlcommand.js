const getCusByID = "select * from Customer where cus_id = ?";

const getAllCustomer = "select * from Customer";

const saveNewSubs = "insert into NewsLetter(email) values(?)"

const subExist = "select * from NewsLetter where email=?"

const updatePro = "update Customer set gender = ?, phone_no = ?, house_address = ?, lga = ?, state = ?, image_url = ? where cus_id = ?"

module.exports = {
    getCusByID,
    getAllCustomer,
    saveNewSubs,
    subExist,
    updatePro,
}
