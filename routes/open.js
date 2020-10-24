const express = require('express');

const router = express.Router();
const c = require('../controllers');

// Route Open

router.get('/', c.general.index);
router.get('/staticdata', c.general.staticdata);
router.post('/login', c.auth.login);
router.post('/signup', c.auth.signup);
router.post('/forgot-password', c.user.passwordForgot);
router.post('/verify-reset-password-token', c.auth.passwordResetTokenValidation);
router.post('/reset-password', c.auth.passwordReset);

module.exports = router;
