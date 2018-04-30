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

  async createNewUser(username, hashedPassword, emailAddress) {
    const userCollection = await users();

    const newUser = {
      username: username,
      hashedPassword: hashedPassword,
      emailAddress: emailAddress,
      _id: uuid(),
    };
    const newInsertInformation = await userCollection.insertOne(newUser);
    if (newInsertInformation.insertedCount === 0) throw "Could not add new book";

    const newId = newInsertInformation.insertedId;
    await this.sendMail(emailAddress, "Welcome to our bookstore!");
    return await this.findById(newId);
  },

  async findByEmail(email) {
    const userCollection = await users();
    const user = await userCollection.findOne({ emailAddress: email });
    if (!user) {
      return null;
    }
    return user;
  },

  async saveToken(token, userId) {
    const userCollection = await users();
    const result = await userCollection.updateOne(
      { "_id" : userId },
      { $set: { "token" : token } }
    );
    if (result.modifiedCount > 0) {
      return token;
    } else {
      return null;
    }
  },

  createURL(id, token) {
    return `localhost:3000/users/password?id=${id}&token=${token}`;
  },

  async sendPasswordResetMail(email,text) {
    const api_key = 'key-ea918321070f9fd75869b26a1686cef9';
    const domain = 'mg.wayne2134.bid';
    const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});
    const data = {
      from: 'Excited User <no-reply@samples.mailgun.org>',
      to: email,
      subject: 'Reset Password',
      text: text
  };

    mailgun.messages().send(data, function (error, body) {
      console.log(body);
    });
  },

  async updatePassword(id, hash) {
    const userCollection = await users();
    const result = userCollection.updateOne(
      {"_id": id},
      {$set: {"hashedPassword": hash}}
    );
    return result.modifiedCount === 1;
  }
};



module.exports = exportedMethods;