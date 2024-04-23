const addOrder = "insert into CustomerOrder(order_id, cus_id) values(?,?)";

const addOrderDetails = "insert into OrderDetails(order_id, prod_id, service_id, quantity) values(?,?,?,?)";

const getService = " select * from Services where prod_id = ? "

const calculateCost = "update OrderDetails set total_sum = ? where order_id = ?" 

const getAnOrder = "SELECT prod_type, service_type, price, quantity, total_sum FROM Product INNER JOIN Services ON `Product`.prod_id = `Services`.prod_id INNER JOIN OrderDetails ON `Services`.service_id = `OrderDetails`.service_id WHERE order_id = ?"

module.exports = { addOrder, addOrderDetails, calculateCost, getService, getAnOrder }