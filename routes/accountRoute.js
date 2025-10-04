const express = require("express")
const utilities = require("../utilities")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))

router.post("/signup",
      regValidate.registrationRules(),
      regValidate.checkRegData,
      utilities.handleErrors(accountController.createAccount)
)

router.post(
      "/login",
      regValidate.loginRules(),
      regValidate.checkLoginData,
      utilities.handleErrors(accountController.accountLogin)
)
router.post("/update", 
      regValidate.accountUpdateRules(),
      regValidate.validateUpdateData,
      utilities.handleErrors(accountController.updateAccount)
)
router.post("/updatePassword",
      regValidate.passwordUpdateRules(),
      utilities.handleErrors(accountController.updatePassword)
)

router.use("/login", utilities.handleErrors(accountController.buildLogin))
router.use("/signup", utilities.handleErrors(accountController.buildSignup))
router.use("/logout", utilities.handleErrors(accountController.logout))



module.exports = router