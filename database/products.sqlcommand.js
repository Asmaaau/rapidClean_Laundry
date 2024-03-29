// Products

const pushProduct =  "insert into Product(prod_id, prod_type, icon_url) values(?,?,?)"

const getAllProds = "select * from Product" 

const getProdByID = "select * from Product where prod_id = ?"

const pushServices =  "insert into Services(service_id, service_type, price) values(?,?)"

module.exports = { pushProduct, getAllProds, getProdByID, pushServices}