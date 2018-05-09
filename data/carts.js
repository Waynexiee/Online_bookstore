const mongoCollections = require("../config/mongoCollections");
const books = mongoCollections.books;
const carts = mongoCollections.carts;
const booksData = require("./books");
let exportedMethods = {
  async addBookToCart(userId, bookId) {
    const cartCollection = await carts();
    let cart = await this.findById(userId);
    if (!(cart)) {
      cart = await this.createNewCart(userId);
    }
    const book = await booksData.getBookById(bookId);
    if (cart.books[bookId]) {
      cart.books[bookId][0] += 1;
    } else {
      cart.books[bookId] = [1, book];
    }
    const result = await cartCollection.updateOne(
      { "_id" : userId },
      { $set: { "books" : cart.books, "total" : cart.total + book.price} }
    );
    if (result.modifiedCount > 0) {
      return await this.findById(userId);
    } else {
      return null;
    }
  },

  async findById(id) {
    const cartCollection = await carts();
    const cart = await cartCollection.findOne({ _id: id });
    if (!cart) {
      return null;
    }
    return cart;
  },

  async createNewCart(id) {
    const cartCollection = await carts();
    const newCart = {
      _id: id,
      books: {},
      total: 0,
    };
    const newInsertInformation = await cartCollection.insertOne(newCart);
    if (newInsertInformation.insertedCount === 0) throw "Could not add new cart";
    return newCart;
  },

  async emptyCart(id) {
    const cartCollection = await carts();
    await cartCollection.remove({_id: id});
  }
};

module.exports = exportedMethods;