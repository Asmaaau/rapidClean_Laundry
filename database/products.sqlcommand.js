// Products

const pushProduct =  "insert into Product(prod_id, prod_type, icon_url) values(?,?,?)"

const getAllProds = "select * from Product" 

const getProdByID = "select * from Product where prod_id = ?"

const pushServices =  "insert into Services(service_type, prod_id, price) values(?,?,?)"

const productByCat = "select * from Product where cat_id = ?"

const updateProduct = "UPDATE Product SET price = CASE WHEN price IS NOT NULL THEN ? ELSE price END, prod_type = CASE WHEN prod_type IS NOT NULL THEN ? ELSE prod_type END WHERE prod_id = ?"

const deleteProduct = "DELETE FROM Product WHERE prod_id = ?"

const deleteProductandServices = "START TRANSACTION; DELETE FROM Table1 WHERE prod_id = ?; DELETE FROM Table2 WHERE prod_id = ?; COMMIT;"

module.exports = { pushProduct, getAllProds, getProdByID, pushServices, productByCat, updateProduct, deleteProduct}