var db = require("../models");

module.exports = function(app) {

  app.get("/api/bv/links/:id", function(req, res) {
    db.Link.findAll({
      where: {
        DinerId: req.params.id
      },
      include: [db.Burger]
    }).then(function(dbLink) {
      res.json(dbLink);
    });
  });

  app.get("/api/dv/links/:id", function(req, res) {
    db.Link.findAll({
      where: {
        BurgerId: req.params.id
      },
      include: [db.Diner]
    }).then(function(dbLink) {
      res.json(dbLink);
    });
  });

  app.put("/api/links", function(req, res) {
    db.Link.update(
    {
      quantity: db.sequelize.literal('quantity + 1')
    },
    {
      where: {
        BurgerId: req.body.BurgerId,
        DinerId: req.body.UserId
      }
    }).then(function(dbLink) {
      res.json(dbLink);
    });
  });

  app.post("/api/links", function(req, res) {
    db.Link.create({
      BurgerId: req.body.BurgerId,
      DinerId: req.body.UserId,
      quantity: db.sequelize.literal('quantity + 1')
    }).then(function(dbLink) {
      res.json(dbLink);
    });
  });

};