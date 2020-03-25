const orderService = require('./order.service')

async function getOrder(req, res) {
    const order = await orderService.getById(req.params.id)
    res.send(order)
}
  
async function getOrders(req, res) {
    const orders = await orderService.query(req.query)
    res.send(orders)
}

async function deleteOrder(req, res) {
    console.log('DELETE ', req.body)
    await orderService.remove(req.params.id)
    res.end()
}

async function updateOrder(req, res) {
    const order = req.body;
    await orderService.update(order)
    res.send(order)
}
async function addOrder(req, res) {
    const order = req.body;
    await orderService.add(order)
    res.send(order)
}

module.exports = {
    getOrder,
    getOrders,
    deleteOrder,
    updateOrder,
    addOrder
}