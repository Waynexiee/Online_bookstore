const mongoCollections = require("../config/mongoCollections");
const orders = mongoCollections.orders;
const uuid = require("node-uuid");
const cart = require("./carts");
const dateTime = require('date-time');
let exportedMethods = {
  async createNewOrder(receiver, address, payment, id) {
    const orderCollection = await orders();
    const myCart = await cart.findById(id);
    const newOrder = {
      receiver: receiver,
      address: address,
      payment: payment,
      books: myCart.books,
      _id: uuid(),
      userId: id,
      date: dateTime(),
      total: myCart.total
    };
    const newInsertInformation = await orderCollection.insertOne(newOrder);
    if (newInsertInformation.insertedCount === 0) throw "Could not add new book";

    const newId = newInsertInformation.insertedId;
    return await this.findById(newId);
  },

  async findById(id) {
    const orderCollection = await orders();
    const order = await orderCollection.findOne({ _id: id });

    if (!order) {
      return null;
    }
    return order;
  },

  async getAllOrders(id) {
    const orderCollection = await orders();
    return await orderCollection.find({userId: id}).toArray();
  }
};
module.exports = exportedMethods;