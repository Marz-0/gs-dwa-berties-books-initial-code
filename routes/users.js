// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')

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
      const insert = "INSERT INTO login_audit (identifier, success, reason, ip) VALUES (?,?,?,?)"
      db.query(insert, [idf, success ? 1 : 0, reason, ip], cb)
    } catch (e) {
      // if logging fails, don't block authentication flow
      if (cb) cb(e)
    }
  }

  // find user by username
  const sql = "SELECT * FROM users WHERE username = ? LIMIT 1"
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
        return logAttempt(identifier, true, 'success', () => res.send('Login successful. Welcome ' + name + '!'))
      } else {
        return logAttempt(identifier, false, 'incorrect password', () => res.send('Login failed: incorrect password'))
      }
    })
  })
}

router.post('/loggedin', handleLogin)
router.post('/login', handleLogin)

router.post('/registered', function (req, res, next) {
    const saltRounds = 10
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
    
  // Store hashed password in your database.

    if (err) return next(err)
    
        // Compare the password supplied with the password in the database
    bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
      if (err) {
        // TODO: Handle error
      }
      else if (result == true) {
        // TODO: Send message
      }
      else {
        // TODO: Send message
      }
    })


    // saving data in database (store firstname, lastname, email and hashed password)
    let sqlquery = "INSERT INTO users (username, first, last, email, hashedPassword) VALUES (?,?,?,?,?)"
    let newrecord = [req.body.username, req.body.first, req.body.last, req.body.email, hashedPassword]
    db.query(sqlquery, newrecord, (err, result) => {
            if (err) {
                    return next(err)
            }
            result = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            result += 'Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(result)

    })

})
}); 


// route to list all users
router.get('/list', function(req, res, next) {
  let sqlquery = "SELECT id, first, last, email FROM users"
  db.query(sqlquery, (err, result) => {
    if (err) {
      return next(err)
    }
    res.render('userslist.ejs', { users: result })
  })
})

// route to show audit history
router.get('/audit', function(req, res, next) {
  const sql = "SELECT id, identifier, success, reason, ip, created_at FROM login_audit ORDER BY created_at DESC"
  db.query(sql, (err, rows) => {
    if (err) return next(err)
    res.render('users_audit.ejs', { audits: rows })
  })
})

// Export the router object so index.js can access it
module.exports = router

