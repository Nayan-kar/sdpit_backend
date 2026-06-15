const express = require("express");

const router = express.Router();

const {
    generateCertificate
} = require("../controllers/certificateController");

router.post("/generate", generateCertificate);

module.exports = router;