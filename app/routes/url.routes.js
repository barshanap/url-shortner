module.exports = app => {
  const url = require("../controllers/url.controller.js");
  var router = require("express").Router();
  // Create a shorten URL
  router.post("/short", url.create);

  // Retrieve all Urls and Search also
  router.get("/urls", url.findAll);


  // Retdirect URLS
  router.get("/tiny/:urlcode", url.reDirectsUrl);
  app.use("/", router);
};
