const express = require("express")
const router = new express.Router()
const utilities = require("../utilities")
const invController = require("../controllers/invController")
const invValidation = require("../utilities/inventory-validation")

// Public routes
router.get("/type/:classificationId", invController.buildByClassificationId);
router.use("/detail/:inventoryId", invController.buildByInventoryId);
router.get("/getInventory/:classificationId", utilities.handleErrors(invController.getInventoryJSON))
router.use("/favorites", utilities.handleErrors(invController.buildFavoritesView))


// Protected routes
router.get("/edit/:inventoryId", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildEditInventoryView)
)

router.get("/delete/:inventoryId", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildDeleteInventoryView)
)

router.get("/add-classification", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildAddClasssificationView))


router.get("/add-inventory", 
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildAddInventoryView))

router.get("/",
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.buildManagementView))



router.post("/update/", 
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.updateInventory)
)

router.post("/delete/",
    utilities.verifyAccountType ,
    utilities.handleErrors(invController.deleteInventory)
)

router.post("/addToFavorite",
    invValidation.favoritesAddingRules(),
    invValidation.checkIDinFavoritesForm,
    utilities.handleErrors(invController.updateFavorite)
)

router.post("/add-classification",
    utilities.verifyAccountType ,
    invValidation.classificationNamingRules(), 
    invValidation.checkClassificationName, 
    utilities.handleErrors(invController.addClassification))

router.post("/add-inventory", 
    utilities.verifyAccountType ,
    invValidation.inventoryCreationRules(),
    invValidation.checkInventoryCreationData,
    utilities.handleErrors(invController.addInventory))

module.exports = router;