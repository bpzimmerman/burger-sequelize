var path = require("path");

module.exports = function(app) {

  // index route
  app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });

  // burgers route
  app.get("/burgers", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/burgers.html"));
  });

  // diners route
  app.get("/diners", function(req, res) {
    res.sendFile(path.join(__dirname, "../public/diners.html"));
  });

};