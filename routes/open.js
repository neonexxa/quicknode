const express = require('express');

const router = express.Router();
const c = require('../controllers');

// Route Open

router.get('/', c.general.index);

module.exports = router;
