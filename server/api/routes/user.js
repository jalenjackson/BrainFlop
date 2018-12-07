const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/checkAuth');
const UsersController = require('../controllers/usersController');

// Sign up
router.post('/signup', UsersController.signUp);

// Facebook authentication
router.post('/facebook', UsersController.facebookAuthentication);

// GET user
router.post('/get-user', UsersController.getUser);

// Forgot password
router.post('/forgot', UsersController.forgotPassword);

// Forgot Password Change
router.post('/forgot/:token', UsersController.forgotPasswordChange);

// Update customized tags
router.post('/update-customized-tags', checkAuth, UsersController.updateCustomizedTags);

// Update user analytics
router.post('/analytics', checkAuth, UsersController.updateUserAnalytics);

// Update user
router.post('/edit', checkAuth, UsersController.editUser);

// Delete user
router.delete('/:userId', checkAuth, UsersController.deleteUser);

// Sign In
router.post('/login', UsersController.login);

module.exports = router;
