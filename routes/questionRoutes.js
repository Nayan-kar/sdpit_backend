const express =
  require("express");

const router =
  express.Router();

const {

  protect,

  authorizeRoles

} = require(
  "../middlewares/authMiddleware"
);

const {

  deleteQuestion

} = require(
  "../controllers/questionController"
);

// ======================================
// DELETE QUESTION
// ======================================

router.delete(

  "/:id",

  protect,

  authorizeRoles("admin"),

  deleteQuestion

);

// ======================================
// EXPORT
// ======================================

module.exports = router;