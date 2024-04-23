// Products

const pushProduct =  "insert into Product(prod_id, prod_type, icon_url, cat_id) values(?,?,?,?)"

const getAllProds = "select * from Product" 

const getProdByID = "select * from Product where prod_id = ?"

const pushServices =  "insert into Services(prod_id, service_type, price) values(?,?,?)"

// const productByCat = "select * from Product where cat_id = ? and isDeleted = 1"
const productByCat = "select * from Product where cat_id = ?"

const updateProduct = "UPDATE Product SET price = CASE WHEN price IS NOT NULL THEN ? ELSE price END, prod_type = CASE WHEN prod_type IS NOT NULL THEN ? ELSE prod_type END WHERE prod_id = ?"

const deleteProduct = "DELETE FROM Product WHERE prod_id = ?"

const deleteProductandServices = "START TRANSACTION; DELETE FROM Table1 WHERE prod_id = ?; DELETE FROM Table2 WHERE prod_id = ?; COMMIT;"

const priceList = "SELECT prod_type, service_type, price FROM `Product` LEFT JOIN `Services` ON `Product`.prod_id = `Services`.prod_id UNION SELECT prod_type, service_type, price FROM `Product` RIGHT JOIN `Services` ON `Product`.prod_id = `Services`.prod_id WHERE `Product`.prod_id IS NULL;"

module.exports = { pushProduct, getAllProds, getProdByID, pushServices, productByCat, updateProduct, deleteProduct, priceList}