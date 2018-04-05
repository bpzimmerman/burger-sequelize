var db = require("../models");

module.exports = function(app) {

  app.get("/api/diners", function(req, res) {
    db.Diner.findAll({
      include: [db.Link]
    }).then(function(dbDiner) {
      res.json(dbDiner);
    });
  });

  app.post("/api/diners", function(req, res) {
    db.Diner.create({
      name: req.body.name
    }).then(function(dbDiner) {
      res.json(dbDiner);
    });
  });

  app.delete("/api/diners", function(req, res) {
    db.Diner.destroy({
      where: {
        id: req.body.id
      }
    }).then(function(dbDiner) {
      res.json(dbDiner);
    });
  });

};