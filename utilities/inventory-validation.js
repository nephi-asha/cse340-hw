const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require('../models/inventory-model') 
const invValidate = {}


invValidate.classificationNamingRules = () => {
    return [
        body('classification_name')
        .trim()
        .notEmpty()
        .matches(/^[a-zA-Z]+$/) 
        .withMessage('Cannot contain a space or special character of any kind.')
    ]      
}


invValidate.inventoryCreationRules = () => { 
    return [
        body('classification_id')
        .notEmpty()
        .withMessage('Please select a classification.'),

        body('inv_make')
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Please provide a make.'),

        body('inv_model')
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Please provide a model.'),

        body('inv_year')
        .trim()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 4, max: 4 })
        .withMessage('Please provide a valid 4-digit year.'),

        body('inv_description')
        .trim()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage('Please provide a description (min 10 characters).'),

        body('inv_image')
        .trim()
        .notEmpty()
        .isLength({min:1})
        .withMessage('Please provide an image path.'),

        body('inv_thumbnail')
        .trim()
        .notEmpty()
        .isLength({min:1})
        .withMessage('Please provide a thumbnail path.'),

        body('inv_price')
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage('Please provide a valid price.'),

        body('inv_miles')
        .trim()
        .notEmpty()
        .isNumeric()
        .withMessage('Please provide a mileage (must be a number).'),

        body('inv_color')
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage('Please provide a color.'),
    ]
}

invValidate.favoritesAddingRules = () => {
    return [
        body('inv_id')
        .trim()
        .notEmpty()
        .isLength({ min: 1 })
        .isNumeric()
        .withMessage("Can't tell the car you're pointing at"),
    ]
}

invValidate.checkClassificationName = async (req , res , next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            res.render("inventory/addClassification", {
                title: "New Classification",
                nav,
                errors,
                classification_name,
            })
            return
    }
    next()
}

invValidate.checkInventoryCreationData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            const classificationList = await utilities.buildClassificationList(req.body.classification_id)
            res.render("inventory/addInventory", {
                title: "New Inventory",
                nav,
                classificationList,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                errors
            })
            return
        }
        next()
}

invValidate.checkUpdateData = async (req, res, next) => {
    const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id, classification_id } = req.body
    let errors = []
    errors = validationResult(req)
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav()
            const classificationList = await utilities.buildClassificationList(classification_id)
            res.render("inventory/editInventory", {
                title: `Edit: ${inv_make} ${inv_model}`,
                nav,
                classificationList,
                inv_make,
                inv_model,
                inv_year,
                inv_description,
                inv_image,
                inv_thumbnail,
                inv_price,
                inv_miles,
                inv_color,
                inv_id,
                errors,
                classification_id 
            })
            return
        }
        next()
}

invValidate.checkIDinFavoritesForm = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)
    if(!errors.isEmpty()) {
        const inventory_id = req.body.inv_id
        const nav = await utilities.getNav()
        
        const inventoryDetails = await invModel.getInventoryItemByInventoryId(inventory_id)
        const detail = await utilities.buildInventoryDetail(inventoryDetails)

        res.render(`./inventory/detail`, {
            title: inventoryDetails.inv_make,
            nav,
            detail
        }) 
        return
    }
    next()
}

module.exports = invValidate
