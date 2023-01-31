// express-jwt is used to secure apis
const expressJwt = require("express-jwt");
const api = process.env.API_URL

// In the unless() method in the path array, we included all the apis which we want to every user whether authorized or unauthorized to be able to access, as our expressJwt makes sure that every api must be accessed by authorized user. SO this is an exception.

exports.authJwt = expressJwt({
  secret: process.env.secret,
  algorithms: ["HS256"],
  isRevoked: isRevoked
}).unless({
  path: [
    {url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
    {url: /\/api\/v1\/products(.*)/, methods: ['GET', 'OPTIONS'] },
    {url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
    {url: /\/api\/v1\/users\/login(.*)/, methods: ['POST', 'OPTIONS'] },
    {url: /\/api\/v1\/users\/register(.*)/, methods: ['POST', 'OPTIONS'] },
    `/${api}/v1/users/login`,
    `/${api}/v1/users/register`,    
  ]
})

// isRevoked function has  helped us to give a role to the admin, to be able to access some apis
async function isRevoked(req, payload, done) {
  if(!payload.isAdmin) {
    done(null, true)
  }

  done();
}