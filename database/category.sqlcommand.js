// Categories

const pushCategory =  "insert into Category(cat_type) values(?)"

const getAllCat = "select * from Category" 

const getCatByID = "select * from Category where cat_id = ?"

// const pushServices =  "insert into Services(service_id, service_type, price) values(?,?,?)"

module.exports = { pushCategory, getAllCat, getCatByID}