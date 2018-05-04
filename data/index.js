/**
 * Created by xiewangzhi on 2018/4/21.
 */
const bookData = require("./books");
const userData = require("./users");
const orderData = require("./orders");
const commentData = require("./comments");
module.exports = {
  books: bookData,
  users: userData,
  orders: orderData,
  comments: commentData
};
