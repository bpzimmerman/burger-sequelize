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

  // app.get("/api/burgers/:id", function(req, res) {
  //   db.Author.findOne({
  //     where: {
  //       id: req.params.id
  //     },
  //     include: [db.Post]
  //   }).then(function(dbAuthor) {
  //     res.json(dbAuthor);
  //   });
  // });

  // app.post("/api/burgers", function(req, res) {
  //   db.Author.create(req.body).then(function(dbAuthor) {
  //     res.json(dbAuthor);
  //   });
  // });

  // app.delete("/api/burgers/:id", function(req, res) {
  //   db.Author.destroy({
  //     where: {
  //       id: req.params.id
  //     }
  //   }).then(function(dbAuthor) {
  //     res.json(dbAuthor);
  //   });
  // });

};