var db = require("../models");

module.exports = function(app) {
  
  app.get("/api/burgers", function(req, res) {
    db.Burger.findAll({
      include: [db.Link]
    }).then(function(dbBurger) {
      res.json(dbBurger);
    });
  });

  app.post("/api/burgers", function(req, res) {
    db.Burger.create({
      burger_name: req.body.name
    }).then(function(dbBurger) {
      res.json(dbBurger);
    });
  });

  app.delete("/api/burgers", function(req, res) {
    db.Burger.destroy({
      where: {
        id: req.body.id
      }
    }).then(function(dbBurger) {
      res.json(dbBurger);
    });
  });

};