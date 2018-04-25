const usersRoutes = require("./users");
const booksRoutes = require("./books");
const adminRoutes = require("./admin");
const constructorMethod = app => {
  app.use("/users", usersRoutes);
  app.use("/admin", adminRoutes);
  app.use("/", booksRoutes);
  app.use("*", (req, res) => {
    res.sendStatus(404);
  });

};

module.exports = constructorMethod;
