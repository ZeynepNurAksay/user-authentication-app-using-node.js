import { Router } from "express";
import {User} from "../models/index.js";
import { DOMAIN } from "../constants/index.js";
import {AuthentionValidations, RegisterValidations, ResetPassword} from "../validators/index.js";
import Validator from "../middlewares/validator-middleware.js";
import {randomBytes} from "crypto";
import sendMail from "../functions/email-sender.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { userAuth } from "../middlewares/auth-guard.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

/**
 * @description To create a new user account. 
 * @access Public
 * @api /users/api/register
 * @type POST
 */

router.post("/api/register", RegisterValidations, Validator, async(req, res) => {
    try {
        let {username, email} = req.body;

        // Check if username is taken or not.
        let user = await User.findOne({username});

        if(user){
            return res.status(400).json({
                message: "Username is already taken.",
                success: false
            });
        }

        user = await User.findOne({email});

        if(user){
            return res.status(400).json({
                message: "Email is already registered. Did you forget the password? Try resetting it.",
                success: false
            });
        }

        user = new User({
            ...req.body,
            verificationCode: randomBytes(20).toString("hex")
        });

        await user.save();

        // Send the email to the user with a verification link. 
        let html = `
            <h1>Hello, ${user.username}</h1>
            <p>Please click the following link to verify your account:</p>
            <a href="${DOMAIN}users/verify-now/${user.verificationCode}">Verify Now</a>
        `;

        await sendMail(user.email, "Verify Account", "Please verify your account.", html);

        return res.status(201).json({
            message: "Hurray! Your account is created. Please verify your email address.",
            success: true
        });
    } catch(err) {
        return res.status(500).json({
            message: "An error occured.",
            success: false
        });
    }
});

/**
 * @description To verify a new user account. 
 * @access Public <Only via email>
 * @api /users/verify-now/:verificationCode
 * @type GET
 */

router.get("/verify-now/:verificationCode", async(req, res) => {
    try {
        let {verificationCode} = req.params;
        let user = await User.findOne({verificationCode});

        if(!user){
            return res.status(401).json({
                message:"Unauthorised access. Invalid verification code.",
                success: false
            });
        }
        user.verified = true;
        user.verificationCode = undefined;
        await user.save();
        return res.sendFile(join(__dirname, "../templates/verification-success.html"));
    } catch(err) {
        console.log("ERR", err.message);
        return res.sendFile(join(__dirname, "../templates/errors.html"));
    }
});

/**
 * @description To authenticate a user and get an authentication token. 
 * @access Public 
 * @api /users/api/authenticate
 * @type POST
 */

router.post("/api/authenticate", AuthentionValidations, Validator, async(req, res) => {
    try {
        let {username, password} = req.body;
        let user = await User.findOne({username});

        if(!user) {
            return res.status(404).json({
                message: "Username not found.",
                success: false
            });
        }

        if(!(await user.comparePassword(password))){
            return res.status(401).json({
                message: "Incorrect password.",
                success: false
            });
        }

        let token = await user.generateJWT();
        return res.status(200).json({
            message: "Hurray! You are now logged in.",
            token: `Bearer ${token}`,
            user: user.getUserInfo(),
            success: true
        });

    } catch (err) {
        console.log("ERR", err.message);
        return res.status(500).json({
            message: "An error occured.",
            success: false
        });
    }
});

/**
 * @description To get the authenticated user's profile.
 * @access Private 
 * @api /users/api/authenticate
 * @type GET
 */

router.get("/api/authenticate", userAuth, async(req,res) => {
    console.log("REQ", req);
    return res.status(200).json({
        user: req.user
    });
});

/**
 * @description To initiate the password reset method
 * @access Public
 * @api /users/api/reset-password
 * @type PUT
 */

router.put('/api/reset-password', ResetPassword, Validator, async(req,res) => {
    try {
        let {email} = req.body;
        let user = await User.findOne({email});

        if(!user){
            return res.status(404).json({
                message: "User with this email is not found.",
                success: false
            });
        }
        user.generatePasswordReset();
        await user.save();

        let html = `
            <h1>Hello, ${user.username}</h1>
            <p>You can ignore this email, if you have not created a password reset request through your account.</p>
            <p>Please click the following link to reset your password:</p>
            <a href="${DOMAIN}users/reset-password-now/${user.resetPasswordToken}">Verify Now</a>
        `;

        await sendMail(user.email, "Reset Password", "Please reset your password.", html);
        return res.status(404).json({
            message: "Password reset link is sent to your email.",
            success: true
        });
    } catch(err) {
        return res.status(500).json({
            message: "An error occured.",
            success: false
        });
    }
});

/**
 * @description To render reset password page.
 * @access Restricted via email
 * @api /users/reset-password-now/:resetPasswordToken
 * @type GET
 */

router.get('/reset-password-now/:resetPasswordToken', async(req,res) => {
    try {
        let {resetPasswordToken} = req.params;
        let user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpiresIn:{$gt: Date.now()}
        });

        if(!user){
            return res.status(401).json({
                message: "Password reset token is invalid or has expired.",
                success: false
            });
        }
        return res.sendFile(join(__dirname, "../templates/password-reset.html"));
    } catch(err) {
        return res.sendFile(join(__dirname, "../templates/errors.html"));
    }
});

/**
 * @description To reset the password.
 * @access Restricted via email
 * @api /users/api/reset-password-now
 * @type POST
 */

router.post('/api/reset-password-now', async(req,res) => {
    try {
        let {password, resetPasswordToken} =  req.body;

        let user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpiresIn:{$gt: Date.now()}
        });

        if(!user){
            return res.status(401).json({
                message: "Password reset token is invalid or has expired.",
                success: false
            });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresIn = undefined;
        await user.save();

        let html = `
            <h1>Hello, ${user.username}</h1>
            <p>Your password is resetted successfully. </p>
            <p>If this reset is not done by you, then you can contact our support team.</p>
        `;

        await sendMail(user.email, "Reset Password Successful", "Your password is changed.", html);

        return res.status(200).json({
            message: "Your password reset request is complete and your password is resetted successfully.",
            success: true
        });
    } catch(err) {
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
});

export default router;