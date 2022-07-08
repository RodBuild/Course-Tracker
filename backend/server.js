var axios = require('axios').default;
const cors = require('cors');
const express = require('express');
const mongodb = require('./database/connect');
const bodyParser = require('body-parser');
const { auth, requiresAuth } = require('express-openid-connect'); // AUTHH0
const swaggerUi = require('swagger-ui-express');
// const swaggerDocumentAuto = require('./swagger/swagger-auto.json');
const swaggerDocument = require('./swagger/swagger.json');

const port = process.env.PORT || 3000;
const app = express();

/** CONFIG auth0 **/
const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: process.env.BASE_URL,
  // baseURL: 'http://127.0.0.1:5500/frontend/test/',
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

/* SWAGGER documentation*/
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocumentAuto), (req, res) => {
//   res.setHeader('Content-Type: text/html; charset=utf-8');
// });
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument), (req, res) => {
  res.setHeader('Content-Type: text/html; charset=utf-8');
});

/* setup EXPRESS app */
app
  /* AUTH0 validation */
  // .use(auth(config))
  .use(auth(config))
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
  .get('/profile', requiresAuth(), (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    // res.status(200).json('te123');
    res.send(`hello ${req.oidc.user.sub}`);
  })
  .get('/login', (req, res) => {
    // res.setHeader('Content-Type', 'application/json');
    // res.oidc.login({ returnTo: 'http://127.0.0.1:5500/frontend/test/' });
    res.oidc.login({ returnTo: '/' });
  })
  .get('/custom-logout', (req, res) => res.oidc.logout({ returnTo: '/' }))
  .get('/', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.oidc.isAuthenticated());
    if (req.oidc.isAuthenticated() == true) {
      res.status(200).json('Logged In');
    } else res.status(200).json('Logged Out');
  })
  .get('/Test', (req, res) => res.send('Welcome to test'))
  .use(bodyParser.json())
  .use('/', require('./routes'));

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
