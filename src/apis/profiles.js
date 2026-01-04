import { Router } from "express";
import {userAuth} from "../middlewares/auth-guard.js";
import uploader from "../middlewares/uploader.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {Profile, User} from "../models/index.js";
import { DOMAIN } from "../constants/index.js";

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @description To create profile of the authenticated user. 
 * @access Private
 * @api /profiles/api/create-profile
 * @type POST <multipart-form> request
 */

router.post('/api/create-profile', userAuth, uploader.single("avatar"), async(req,res) => {
    try {
        let {body,file,user} = req;
        let path = DOMAIN + file.path.split('uploads/')[1];
        let profile = new Profile({
            social: body,
            account: user._id,
            avatar: path
        });
        await profile.save();
        return res.status(201).json({
            message: "Profile created successfully",
            success: true
        });
    } catch(err) {
        return res.status(400).json({
            message: "Unable to create your profile.",
            success: false
        });
    }
});

/**
 * @description To get the authenticated user's profile. 
 * @access Private
 * @api /profiles/api/my-profile
 * @type GET
 */

router.get('/api/my-profile', userAuth, async(req,res) => {
    try {
        let profile = await Profile.findOne({account: req.user._id}).populate('account', 'name email username');
        if(!profile) {
            return res.status(404).json({
                message: "Your profile is not available.",
                success: false
            });
        }
        return res.status(200).json({
            profile,
            success: true
        });
    } catch(err) {
        return res.status(400).json({
            message: "Unable to get the profile.",
            success: false
        });
    }
});

/**
 * @description To update the authenticated user's profile. 
 * @access Private
 * @api /profiles/api/update-profile
 * @type PUT <multipart-form> request
 */

router.put('/api/update-profile', userAuth, uploader.single('avatar'), async(req,res) => {
    try {
        let {body,file,user} = req;
        let path = DOMAIN + file.path.split('uploads/')[1];
        let profile = await Profile.findOneAndUpdate(
            { account: user._id}, 
            {social:body, avatar: path},
            {new: true});
        return res.status(200).json({
            message: "Your profile is now updated.",
            profile,
            success: true
        });
    } catch (err) {
        return res.status(400).json({
            message: "Unable to get the profile.",
            success: false
        });
    }
});

/**
 * @description To get the user's profile with the username. 
 * @access Public
 * @api /profiles/api/profile-user
 * @type GET
 */

router.get('/api/profile-user/:username', async(req,res) => {
    try {
        let {username} = req.params;
        let user = await User.findOne({username});

        if(!user) {
            return res.status(404).json({
                message: "User not found.",
                success: false
            });
        }

        let profile = await Profile.findOne({account: user._id});
        return res.status(200).json({
            profile: {
                ...profile.toObject(),
                account: user.getUserInfo()
            },
            success: true
        });
    } catch (err) {
        return res.status(400).json({
            message: "Something went wrong.",
            success: false
        });
    }
});

export default router;
