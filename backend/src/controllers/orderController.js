const orderService = require("../services/orderService");

async function listOrders(req, res, next) {
  try {
    res.json({ data: await orderService.listOrdersForUser(req.user) });
  } catch (error) {
    next(error);
  }
}

async function createOrder(req, res, next) {
  try {
    const order = await orderService.createOrder(req.user, req.body);
    res.status(201).json({ data: order });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  try {
    const order = await orderService.updateStatus(req.params.id, req.body.status);
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
}

async function deleteOrder(req, res, next) {
  try {
    const order = await orderService.deleteOrder(req.params.id);
    res.json({ data: order });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
