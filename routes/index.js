const usersRoutes = require("./users");
const booksRoutes = require("./books");
const adminRoutes = require("./admin");
const cartRoutes = require("./carts");
const orderRoutes = require("./orders");
const commentRoutes = require("./comments");
const constructorMethod = app => {
  app.use("/users", usersRoutes);
  app.use("/admin", adminRoutes);
  app.use("/cart", cartRoutes);
  app.use("/order", orderRoutes);
  app.use("/comment", commentRoutes);
  app.use("/", booksRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });

};

module.exports = constructorMethod;
