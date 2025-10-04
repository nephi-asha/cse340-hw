const utilities = require("../utilities")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config() 

// Deliver Login View
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("./account/login", {
      title: "Login",
      nav,
      errors: null,
  })
}
// Deliver register view
async function buildSignup(req, res, next) {
  console.log(req.url)
  let nav = await utilities.getNav()
  res.render("./account/signup", {
      title: "Sign Up",
      nav,
      errors: null,
  })
}

// Process Registration
async function createAccount(req, res) {

    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body
    let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Error processing the registration.')
    res.status(500).render("account/signup", {
      title: "Sign Up",
      nav,
      errors: null,
    })
    return
  }

    const regResult = await accountModel.createAccount(account_firstname, account_lastname, account_email, hashedPassword)

    if (regResult) {
        req.flash("notice", `Congratulation, you\'re registered ${account_firstname}. Please log in.`)
        res.status(201).render("account/login", {
            title: "Login",
            nav,
            errors: null,
        })
    } else {
        req.flash("notice", "Sorry, the registration failed.")
        res.status(501).render("account/signup", {
            title: "Sign Up",
            nav,
            errors: null,
        })
    }
}

// Process login
async function accountLogin(req, res) {
  const { account_email, account_password } = req.body
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    nav,
    title: "Login",
    errors: null,
    account_email,
   })
  return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
        delete accountData.account_password
const accessToken = jwt.sign(accountData, process.env.SESSION_SECRET, { expiresIn: 3600 * 1000 })
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
        return res.redirect("/account/")
    }
  } catch (error) {
    req.flash("notice", "An error occurred during login.")
    res.status(500).render("account/login", {
      nav,
      title: "Login",
      errors: null,
      account_email
    })
    return
  }

  req.flash("notice", "Please check your credentials and try again.")
  res.status(501).render("account/login", {
    nav,
    title: "Login",
    errors: null,
    account_email
  })
}

async function buildManagement(req, res) {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()
  const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  res.render("account/accountManagement", {
    nav,
    title: "Management",
    accountData,
    classificationList,
    errors: null
  })
}

async function updateAccount(req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const updateResult = await accountModel.updateAccountInfo(account_firstname, account_lastname, account_email, account_id)

  if (updateResult) {
    req.flash("notice", `Account updated successfully`)

    const accountData = updateResult
    delete accountData.account_password
    const accessToken = jwt.sign(accountData, process.env.SESSION_SECRET, { expiresIn: 3600 * 1000 })
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })

    res.status(201).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
  } else {
    req.flash("notice", "Account update failed")
    const accountData = await accountModel.getAccountById(account_id)
    res.status(501).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
  }
}

async function updatePassword(req, res) {
  const nav = await utilities.getNav()
     const {account_password, account_id} = req.body

     const accountData = await accountModel.getAccountById(res.locals.accountData.account_id)
  let hashedPassword
  try {

    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password')
    res.status(500).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
  }

  const updateResult = await accountModel.updatePassword(hashedPassword, account_id)

  if(updateResult) {
    req.flash("notice", `Password updated successfully`)

    res.status(201).render("account/accountManagement", {
      nav,
      title: "Management",
      accountData,
      errors: null
    })
   } else {
      req.flash("notice", "Password update failed")
      res.status(501).render("account/accountManagement", {
        nav,
        title: "Management",
        accountData,
        errors: null
      })
    }
  
}

async function logout(req, res) {
  const nav = await utilities.getNav();
  res.clearCookie("jwt");
  res.locals.loggedin = 0;
  res.locals.accountData = null;
  req.flash("notice", "You have been logged out.");
  res.redirect("/");
}


module.exports = { buildLogin, buildSignup, createAccount, accountLogin, buildManagement, updateAccount, updatePassword, logout }