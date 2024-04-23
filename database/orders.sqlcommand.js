const addOrder = "insert into CustomerOrder(order_id, cus_id) values(?,?)";

const addOrderDetails = "insert into OrderDetails(order_id, prod_id, service_id, quantity) values(?,?,?,?)";

module.exports = { addOrder, addOrderDetails }