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
  }
};

module.exports = exportedMethods;