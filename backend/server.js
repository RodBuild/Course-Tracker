var axios = require('axios').default;
const cors = require('cors');
const express = require('express');
const mongodb = require('./database/connect');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect'); // AUTHH0
const swaggerUi = require('swagger-ui-express');
const swaggerDocumentAuto = require('./swagger/swagger-auto.json');
// const swaggerDocument = require('./swagger/swagger.json');

const port = process.env.PORT || 3000;
const app = express();

/** CONFIG auth0 **/
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  // baseURL: process.env.BASE_URL_TEST,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  // Source for custom routes (Section 3):
  // https://github.com/auth0/express-openid-connect/blob/master/examples/custom-routes.js
  routes: {
    login: false,
    postLogoutRedirect: '/custom-logout'
  }
};

/* setup EXPRESS app */
app
  /* AUTH0 validation */
  // .use(auth(config))
  .use(auth(config))
  .get('/profile', requiresAuth(), (req, res) => res.send(`hello ${req.oidc.user.sub}`))
  .get('/login', (req, res) => res.oidc.login({ returnTo: '/profile' }))
  .get('/custom-logout', (req, res) => res.oidc.logout({ returnTo: '/test' }))
  .get('/', (req, res) => res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out'))
  .get('/Test', (req, res) => res.send('Welcome to test'))
  .use(bodyParser.json())
  .use(cors())
  .use((req, res, next) => {
    // Change * to specific websites if so desired
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use('/', require('./routes'));

/* SWAGGER documentation*/
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAuto));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// to catch errors through the program
process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n + Exception origin: ${origin}`);
});

// connect to database
mongodb.initDb((err) => {
  if (err) {
    console.error(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listen on port ${port}`);
  }
});
