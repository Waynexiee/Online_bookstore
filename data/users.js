const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const uuid = require("node-uuid");

let exportedMethods = {
  async findById(id) {
    const userCollection = await users();
    const user = await userCollection.findOne({ _id: id });

    if (!user) {
      return null;
    }
    return user;
  },

  async findByUsername(username) {
    const userCollection = await users();
    const user = await userCollection.findOne({ username: username });

    if (!user) {
      return null;
    }
    return user;
  },

  async createNewUser(username, hashedPassword) {
    const userCollection = await users();

    const newUser = {
      username: username,
      hashedPassword:hashedPassword,
      _id: uuid(),
    };
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Could not add new book";

    const newId = newInsertInformation.insertedId;

    return await this.findById(newId);
  }
};

module.exports = exportedMethods;