// pull in controllers
const controllers = require('./controllers');

// handles routing for the app
const router = (app) => {
  app.get('/', controllers.servePages.homePage);
};

// export the router
module.exports = router;
