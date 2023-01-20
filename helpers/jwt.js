// express-jwt is used to secure apis
const expressJwt = require("express-jwt");
const api = process.env.API_URL

// In the unless() method in the path array, we included all the apis which we want to every user whether authorized or unauthorized to be able to access, as our expressJwt makes sure that every api must be accessed by authorized user. SO this is an exception.

exports.authJwt = expressJwt({
  secret: process.env.secret,
  algorithms: ["HS256"],
}).unless({
  path: [
    `/${api}/v1/users/login`,
    `/${api}/v1/users/register`,
    {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
    {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
  ]
})
