const express = require("express")
require("dotenv").config() 
const app = express()
const expressLayouts = require("express-ejs-layouts")
const session = require("express-session")

const cookieParser = require("cookie-parser")

const staticRoute = require("./routes/static") 
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const reviewRoute = require("./routes/review-route")
const utilities = require("./utilities/")
const pool = require("./database")

app.use(cookieParser())

app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  name: 'sessionId',
}))

app.use(require('connect-flash')())

app.use(function(req, res, next){
  res.locals.messages = () => {
    const messages = req.flash();
    let html = '';
    if (Object.keys(messages).length > 0) {
      html += '<ul class="notice">';
      for (const type in messages) {
        messages[type].forEach(message => {
          html += `<li>${message}</li>`;
        });
      }
      html += '</ul>';
    }
    return html;
  };
  next();
})

app.use(utilities.checkJWTToken)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")


app.use(staticRoute)

app.get("/", utilities.handleErrors(baseController.buildHome))

app.use("/inv", utilities.handleErrors(inventoryRoute))
app.use("/account", utilities.handleErrors(accountRoute))
app.use("/reviews", utilities.handleErrors(reviewRoute))


const { NotFound } = require("./utilities/errors");

app.use(async (req, res, next) => {
  next(new NotFound('Sorry, we appear to have lost that page.'))
})

app.use(async (err, req, res, next) => {
  let nav = '<ul><li><a href="/" title="Home">Home</a></li></ul>'
  const isDevelopment = process.env.NODE_ENV === 'development'
  if (isDevelopment) {
    console.error(err)
  } else {
    console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  }
  let message 
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
      title: err.status || 'Server Error',
      message,
      nav,
      error: isDevelopment ? err : null
    })
})

const port = process.env.PORT || 5000
const host = process.env.HOST || '0.0.0.0'

app.listen(port, () => {
})
