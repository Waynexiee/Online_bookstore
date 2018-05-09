/**
 * Created by xiewangzhi on 2018/4/22.
 */
const mongoCollections = require("../config/mongoCollections");
const comments = mongoCollections.comments;
const uuid = require("node-uuid");
const dateTime = require('date-time');

let exportedMethods = {
    async createComment(user, id, comment) {
        const commentCollection = await comments();
        const newComment = {
             comment: comment,
             bookId: id,
             _id: uuid(),
             date: dateTime(),
             username: user
        }     

        const newInsertInformation = await commentCollection.insertOne(newComment);
        if (newInsertInformation.insertedCount === 0) throw "Could not add new comment";

         const newId = newInsertInformation.insertedId;
         return await this.findById(newId);
    }, 

    async findById(id) {
        const commentCollection = await comments();
        const comment = await commentCollection.findOne({ _id: id });
    
        if (!comment) {
          return null;
        }
        return comment;
    },

    async getAllComments(bookId) {
        const commentCollection = await comments();
        return await commentCollection.find({bookId: bookId}).toArray();
    }
};

module.exports = exportedMethods;
