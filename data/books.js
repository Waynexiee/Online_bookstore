const mongoCollections = require("../config/mongoCollections");
const books = mongoCollections.books;
const uuid = require("node-uuid");

const exportedMethods = {
  async getAllBooks() {
    const bookCollection = await books();
    return await bookCollection.find({}).toArray();
  },

  async getBookById(id) {
    const bookCollection = await books();
    const book = await bookCollection.findOne({ _id: id });

    if (!book) throw "book is not found";
    return book;
  },

  async addBook(title, price, author, stock, picture_url, description) {
    if (typeof title !== "string") throw "No title provided";

    const bookCollection = await books();

    const newBook = {
      title: title,
      price: price,
      author: author,
      _id: uuid(),
      stock: stock,
      picture_url: picture_url,
      description: description
    };
    const newInsertInformation = await bookCollection.insertOne(newBook);
    if (newInsertInformation.insertedCount === 0) throw "Could not add new book";

    const newId = newInsertInformation.insertedId;

    return await this.getBookById(newId);
  }


};

module.exports = exportedMethods;