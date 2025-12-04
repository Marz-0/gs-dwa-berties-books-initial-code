// Create a new router
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const main = require('./main')
const { check, validationResult } = require('express-validator');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId) {
        res.redirect("./login"); // redirect to the login page
    } else {
        next(); // move to the next middleware function
    }
};


router.get('/register', function (req, res, next) {
  res.render('register.ejs')
})

router.get('/login', function (req, res, next) {
  res.render('login.ejs')
})

// shared login handler used by both POST /login and POST /loggedin
function handleLogin(req, res, next) {
  const identifier = (req.body.identifier || '').trim()
  const plainPassword = req.body.password || ''

  if (!identifier || !plainPassword) {
    return res.send('Login failed: missing username/email or password')
  }

  // log login attempt
  function logAttempt(idf, success, reason, cb) {
    try {
      const ip = (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.ip || '').toString()
      const insert = 'INSERT INTO login_audit (identifier, success, reason, ip) VALUES (?,?,?,?)'
      db.query(insert, [idf, success ? 1 : 0, reason, ip], cb)
    } catch (e) {
      if (cb) cb(e)
    }
  }

  // find user by username
  const sql = 'SELECT * FROM users WHERE username = ? LIMIT 1'
  db.query(sql, [identifier], (err, results) => {
    if (err) return next(err)
    if (!results || results.length === 0) {
      return logAttempt(identifier, false, 'user not found', () => res.send('Login failed: user not found'))
    }

    const user = results[0]
    const hashed = user.password || user.hashedPassword || user.hashed_password || user.pass
    if (!hashed) {
      return logAttempt(identifier, false, 'no password stored', () => res.send('Login failed: no password stored for this user'))
    }

    bcrypt.compare(plainPassword, hashed, (err, match) => {
      if (err) return next(err)
      if (match) {
        const name = user.first || user.username || user.email || 'user'
        try {
          req.session.userId = user.id
          req.session.username = user.username
          req.session.name = name
        } catch (e) {}
        return logAttempt(identifier, true, 'success', () => res.redirect('../users/loggedin'))
      } else {
        return logAttempt(identifier, false, 'incorrect password', () => res.send('Login failed: incorrect password'))
      }
    })
  })
}

router.post('/loggedin', handleLogin)
router.post('/login', handleLogin)

// Logged-in confirmation page
router.get('/loggedin', redirectLogin, function (req, res, next) {
  const name = req.session && (req.session.name || req.session.username) || 'user'
  res.send('Login successful. Welcome ' + name + '! <a href="/">Home</a>')
})

router.post('/registered', 
                 [check('email').isEmail(), 
                  check('username').isLength({ min: 5, max: 20}),
                  check('password').isLength({ min: 8 }),
                  check('first').notEmpty(),
                  check('last').notEmpty()
                ], 
                 function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('./register')
    }
    else { 

          
  const saltRounds = 10
  const plainPassword = req.body.password || ''
  bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
    if (err) return next(err)

    const sqlquery = 'INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)'
    const newrecord = [req.body.username, req.sanitize(req.body.first), req.sanitize(req.body.last), req.sanitize(req.body.email), req.sanitize(hashedPassword)]
    db.query(sqlquery, newrecord, (err, result) => {
      if (err) return next(err)
      let resultMsg = 'Hello ' + req.sanitize(req.body.first) + ' ' + req.sanitize(req.body.last) + ' you are now registered! We will send an email to you at ' + req.sanitize(req.body.email)
      resultMsg += ' Your password is: ' + req.sanitize(req.body.password) + ' and your hashed password is: ' + req.sanitize(hashedPassword)
      res.send(resultMsg)
    })
  })}
})


// route to list all users (protected)
router.get('/list', redirectLogin, function (req, res, next) {
  let sqlquery = 'SELECT id, username, first, last, email FROM users'
  db.query(sqlquery, (err, result) => {
    if (err) return next(err)
    res.render('userslist.ejs', { users: result })
  })
})

// route to show audit history (protected)
router.get('/audit', redirectLogin, function (req, res, next) {
  const sql = 'SELECT id, identifier, success, reason, ip, created_at FROM login_audit ORDER BY created_at DESC'
  db.query(sql, (err, rows) => {
    if (err) return next(err)
    res.render('users_audit.ejs', { audits: rows })
  })
})

// Logout route for users 
    router.get('/logout', redirectLogin, (req,res) => {
        req.session.destroy(err => {
        if (err) {
          return res.redirect('./')
        }
        res.send('you are now logged out. <a href="/">Home</a>');
        })
    })



// Export the router object so index.js can access it
module.exports = router
