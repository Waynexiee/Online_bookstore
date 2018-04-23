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

    if (!book) throw "book not found";
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
  },

  async addBookById(id, updatedBook) {
    if (typeof updatedBook.title !== "string") throw "No title provided";

    if (!Array.isArray(updatedBook.ingredients)) {
      ingredients = [];
    }

    if (!Array.isArray(updatedBook.steps)) {
      steps = [];
    }
    const bookCollection = await books();


    const newBook = {
      title: updatedBook.title,
      ingredients: updatedBook.ingredients,
      steps: updatedBook.steps,
      _id: id
    };

    await bookCollection.insertOne(newBook);
  },

  async removeBook(id) {
    const bookCollection = await books();
    const deletionInfo = await bookCollection.removeOne({ _id: id });
    if (deletionInfo.deletedCount === 0) {
      throw `Could not delete book with id of ${id}`;
    }
  },

  async updateBook(id, updatedBook) {
    const updatedBookData = await this.getBookById(id);

    if (updatedBook.title) {
      updatedBookData.title = updatedBook.title;
    }

    if (updatedBook.ingredients) {
      updatedBookData.ingredients = updatedBook.ingredients;
    }

    if (updatedBook.steps) {
      updatedBookData.steps = updatedBook.steps;
    }
    console.log(id);
    await this.removeBook(id);
    await this.addBookById(id, updatedBookData);
    return await this.getBookById(id);
  },

  async patchBook(id, updatedBook) {
    const bookCollection = await books();

    const updatedBookData = {};

    if (updatedBook.title) {
      updatedBookData.title = updatedBook.title;
    }

    if (updatedBook.ingredients) {
      updatedBookData.ingredients = updatedBook.ingredients;
    }

    if (updatedBook.steps) {
      updatedBookData.steps = updatedBook.steps;
    }

    let updateCommand = {
      $set: updatedBookData
    };
    const query = {
      _id: id
    };
    await bookCollection.updateOne(query, updateCommand);

    return await this.getBookById(id);
  }
};

module.exports = exportedMethods;