const express = require('express');
const userController = require('../controllers/UserController');


// making the router object
const userRouter = express.Router();


// local authentication endpoint
userRouter.post('/register', userController.post_register);
userRouter.post('/login', userController.post_login);
userRouter.get('/register', userController.get_register);
userRouter.get('/register/:err', userController.get_register_with_error);
userRouter.get('/login', userController.get_login);
userRouter.get('/login/:err', userController.get_login_with_error)
userRouter.get('/logout', userController.logout);
userRouter.get('/otp', userController.verify_otp)


// google auth endpoints
userRouter.get('/auth/google', userController.google_auth);
userRouter.get('/auth/google/redirect', userController.google_auth_redirect, userController.googleAuthLogin)
userRouter.post('/auth/google/register/:userId', userController.googleAuthRegister);
userRouter.get('/auth/google/register/:userId', userController.get_google_auth_register);
userRouter.get('/auth/google/register/:userId/:err', userController.get_google_auth_register_with_err);


// user promotion endpoints
userRouter.post('/promote', userController.promoteUser);
userRouter.get('/promote', userController.getPromoteUser)


// other endpoints
userRouter.get('/dashboard', userController.get_dashboard);
userRouter.get('/get/:userId', userController.read);
userRouter.put('/update/:userId', userController.update);
userRouter.delete('/delete/:userId', userController.del);



module.exports = userRouter
