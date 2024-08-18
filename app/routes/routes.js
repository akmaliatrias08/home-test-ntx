const controllers = require("../controllers");
const { tokenValidation } = require("../middleware");

module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  const express = require("express")
  const router = express.Router();

  //survey routes
  router.get(
    "/refactor-1",
    tokenValidation,
    controllers.survey.refactoreMe1
  );

  router.post(
    "/refactor-2",  
    controllers.survey.refactoreMe2
  );

  //attacks route
  router.get(
    "/attacks",
    tokenValidation, 
    controllers.attacks.getData
  )

  //user route
  router.post(
    "/register", 
    controllers.users.register
  )

  router.post(
    "/login", 
    controllers.users.login
  )

  app.use("/api/data", router);
};
